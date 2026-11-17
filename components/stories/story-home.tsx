"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { getPublicStories, isSampleCollection } from "@/lib/stories";
import { StoryCover } from "./story-cover";

const INTERVAL_MS = 5000;

/**
 * Slider Beranda: item aktif selalu berada di tengah, dengan sebagian item
 * tetangga terlihat. Scroll-snap memberi dukungan swipe native pada Android/iOS.
 * Tiga rangkaian identik menjaga tetangga slide tetap sama saat loop di-reset.
 */
export function StoryHome() {
  const stories = getPublicStories().slice(0, 5);
  const length = stories.length;
  const loop = length > 1;
  const slides = loop ? [...stories, ...stories, ...stories] : stories;
  const start = loop ? length : 0;

  const viewportRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const physicalRef = useRef(start);
  const movingRef = useRef(false);
  const scrollEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const realIndex = useCallback((position: number) => {
    return length ? ((position % length) + length) % length : 0;
  }, [length]);

  // Pusat kartu tidak berubah oleh scale CSS; rect juga mempertahankan subpixel.
  const positionLeft = useCallback((position: number) => {
    const viewport = viewportRef.current;
    const slide = slidesRef.current[position];
    if (!viewport || !slide) return null;
    const viewportRect = viewport.getBoundingClientRect();
    const rect = slide.getBoundingClientRect();
    return viewport.scrollLeft + rect.left + rect.width / 2
      - viewportRect.left - viewport.clientLeft - viewport.clientWidth / 2;
  }, []);

  const scrollToPosition = useCallback((position: number, behavior: ScrollBehavior = "smooth") => {
    const left = positionLeft(position);
    if (left !== null) viewportRef.current?.scrollTo({ left, behavior });
  }, [positionLeft]);

  const clearScrollEnd = useCallback(() => {
    if (scrollEndRef.current !== null) {
      clearTimeout(scrollEndRef.current);
      scrollEndRef.current = null;
    }
  }, []);

  const settlePosition = useCallback(() => {
    clearScrollEnd();
    const viewport = viewportRef.current;
    if (!viewport || !length) { movingRef.current = false; return; }

    let closest = physicalRef.current;
    let smallestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < slides.length; i += 1) {
      const left = positionLeft(i);
      if (left === null) continue;
      const distance = Math.abs(viewport.scrollLeft - left);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closest = i;
      }
    }

    const real = realIndex(closest);
    const canonical = start + real;
    physicalRef.current = canonical;
    setActive(real);
    // Reset hanya setelah scroll selesai. Kedua posisi menampilkan kartu dan
    // tetangga yang identik, termasuk class is-current pada semua salinannya.
    if (closest !== canonical) {
      movingRef.current = true;
      scrollToPosition(canonical, "instant");
      // Event scrollend dari reset juga harus selesai sebelum menerima input baru.
      scrollEndRef.current = setTimeout(() => {
        movingRef.current = false;
        scrollEndRef.current = null;
      }, 180);
      return;
    }
    movingRef.current = false;
  }, [clearScrollEnd, length, positionLeft, realIndex, scrollToPosition, slides.length, start]);

  const scheduleSettle = useCallback(() => {
    movingRef.current = true;
    clearScrollEnd();
    // Fallback untuk browser yang belum memiliki event scrollend.
    scrollEndRef.current = setTimeout(settlePosition, 180);
  }, [clearScrollEnd, settlePosition]);

  // Initial centering, responsive resize, and user reduced-motion preference.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    const viewport = viewportRef.current;
    let width = viewport?.clientWidth ?? 0;
    const center = () => {
      clearScrollEnd();
      const real = realIndex(physicalRef.current);
      physicalRef.current = start + real;
      setActive(real);
      scrollToPosition(physicalRef.current, "instant");
      movingRef.current = false;
    };
    const frame = window.requestAnimationFrame(center);
    const observer = new ResizeObserver(() => {
      const nextWidth = viewport?.clientWidth ?? 0;
      if (nextWidth !== width) { width = nextWidth; center(); }
    });
    if (viewport) {
      observer.observe(viewport);
      viewport.addEventListener("scrollend", settlePosition);
    }
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", updatePreference);
      observer.disconnect();
      viewport?.removeEventListener("scrollend", settlePosition);
      clearScrollEnd();
    };
  }, [clearScrollEnd, realIndex, scrollToPosition, settlePosition, start]);

  const goTo = useCallback((position: number) => {
    if (!loop || movingRef.current) return;
    const viewport = viewportRef.current;
    const left = positionLeft(position);
    if (!viewport || left === null) return;
    physicalRef.current = position;
    setActive(realIndex(position));
    if (Math.abs(viewport.scrollLeft - left) < 1) {
      settlePosition();
      return;
    }
    // Jangan reset posisi atau mulai scroll baru di tengah animasi.
    movingRef.current = true;
    scrollToPosition(position, reducedMotion ? "instant" : "smooth");
    scheduleSettle();
  }, [loop, positionLeft, realIndex, reducedMotion, scheduleSettle, scrollToPosition, settlePosition]);

  const step = useCallback((delta: number) => {
    if (!loop || movingRef.current) return;
    goTo(physicalRef.current + delta);
  }, [goTo, loop]);

  const selectStory = useCallback((index: number) => {
    if (!loop || movingRef.current) return;
    // Dot menggunakan salinan terdekat, termasuk dari 03 langsung ke 01.
    const current = physicalRef.current;
    let delta = index - realIndex(current);
    if (delta > length / 2) delta -= length;
    if (delta < -length / 2) delta += length;
    if (delta !== 0) goTo(current + delta);
  }, [goTo, length, loop, realIndex]);

  useEffect(() => {
    if (!loop || !autoplay || interacting || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") step(1);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, interacting, loop, reducedMotion, step]);

  if (!length) return null;

  return (
    <section className="kj-home kj-showcase" aria-labelledby="kj-home-heading">
      <div className="kj-showcase-heading">
        <div className="kj-showcase-title">
          <span className="eyebrow">CERITA DARI PESERTA KOMPETISI</span>
          <h2 id="kj-home-heading">Kisah Juara<span>.</span></h2>
        </div>
        <Link href="/kisah-juara" className="section-link">Jelajahi semua kisah <Icon name="arrow" size={15}/></Link>
      </div>

      <div
        className="kj-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Pilihan Kisah Juara"
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setInteracting(true); }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") setInteracting(false); }}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false);
        }}
        onPointerDown={() => setInteracting(true)}
        onPointerUp={(event) => { if (event.pointerType !== "mouse") setInteracting(false); }}
        onPointerCancel={() => setInteracting(false)}
      >
        <div className="kj-carousel-viewport" ref={viewportRef} onScroll={scheduleSettle}>
          {slides.map((story, physicalIndex) => {
            const clone = loop && (physicalIndex < start || physicalIndex >= start + length);
            return (
              <div
                key={`${story.slug}-${physicalIndex}`}
                className={`kj-carousel-slide${clone ? " kj-carousel-clone" : ""}${realIndex(physicalIndex) === active ? " is-current" : ""}`}
                ref={(node) => { slidesRef.current[physicalIndex] = node; }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${realIndex(physicalIndex) + 1} dari ${length}: ${story.title}`}
                aria-hidden={clone ? true : undefined}
              >
                <article className="kj-carousel-story">
                  <Link href={`/kisah-juara/${story.slug}`} className="kj-carousel-visual" tabIndex={clone ? -1 : undefined} aria-label={`Baca kisah: ${story.title}`}>
                    <StoryCover story={story} size="feature"/>
                  </Link>
                  <div className="kj-carousel-copy">
                    <span className="kj-carousel-meta">KISAH JUARA <span aria-hidden="true">/</span> {story.category.toUpperCase()}</span>
                    <h3><Link href={`/kisah-juara/${story.slug}`} tabIndex={clone ? -1 : undefined}>{story.title}</Link></h3>
                    <div className="kj-carousel-bottom">
                      <span className="kj-carousel-person">{story.participants} · {story.year}</span>
                      <Link href={`/kisah-juara/${story.slug}`} className="kj-carousel-read" tabIndex={clone ? -1 : undefined}>Baca kisah <Icon name="arrow" size={15}/></Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
        {loop && (
          <>
            <button type="button" className="kj-carousel-arrow kj-carousel-prev" aria-label="Kisah sebelumnya" onClick={() => step(-1)}><Icon name="chevron" size={20}/></button>
            <button type="button" className="kj-carousel-arrow kj-carousel-next" aria-label="Kisah berikutnya" onClick={() => step(1)}><Icon name="chevron" size={20}/></button>
          </>
        )}
      </div>

      <div className="kj-carousel-footer">
        <div className="kj-carousel-dots" aria-label="Pilih Kisah Juara">
          {stories.map((story, index) => (
            <button type="button" key={story.slug} aria-label={`Lihat kisah ${index + 1}: ${story.title}`} aria-current={index === active ? "true" : undefined} className={index === active ? "is-active" : ""} onClick={() => selectStory(index)}/>
          ))}
        </div>
        {loop && <div className="kj-carousel-play-controls">
          <span className="kj-carousel-count">{String(active + 1).padStart(2, "0")} / {String(length).padStart(2, "0")}</span>
          <button type="button" className="kj-carousel-pause" onClick={() => setAutoplay((playing) => !playing)} aria-label={autoplay ? "Jeda rotasi otomatis" : "Aktifkan rotasi otomatis"}>{autoplay ? "Jeda" : "Putar"}</button>
        </div>}
      </div>
      {isSampleCollection(stories) && <p className="kj-demo-note"><Icon name="info" size={13}/> Kisah simulasi, belum berdasarkan wawancara nyata.</p>}
    </section>
  );
}
