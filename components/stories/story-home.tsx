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
 * Satu salinan item terakhir/pertama di tiap ujung memungkinkan loop mulus.
 */
export function StoryHome() {
  const stories = getPublicStories().slice(0, 5);
  const length = stories.length;
  const loop = length > 1;
  const slides = loop ? [stories[length - 1], ...stories, stories[0]] : stories;

  const viewportRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const physicalRef = useRef(loop ? 1 : 0);
  const scrollEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(loop ? 1 : 0);
  const [autoplay, setAutoplay] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const scrollToPosition = useCallback((position: number, behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    const slide = slidesRef.current[position];
    if (!viewport || !slide) return;
    const left = slide.offsetLeft - (viewport.clientWidth - slide.clientWidth) / 2;
    viewport.scrollTo({ left, behavior });
  }, []);

  const settlePosition = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || !length) return;

    let closest = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < slides.length; i += 1) {
      const item = slidesRef.current[i];
      if (!item) continue;
      const left = item.offsetLeft - (viewport.clientWidth - item.clientWidth) / 2;
      const distance = Math.abs(viewport.scrollLeft - left);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closest = i;
      }
    }

    // Pindah secara instan setelah mencapai clone ujung: tidak ada lompatan visual.
    if (loop && closest === 0) {
      physicalRef.current = length;
      setDisplayIndex(length);
      scrollToPosition(length, "instant");
      setActive(length - 1);
    } else if (loop && closest === length + 1) {
      physicalRef.current = 1;
      setDisplayIndex(1);
      scrollToPosition(1, "instant");
      setActive(0);
    } else {
      physicalRef.current = closest;
      setDisplayIndex(closest);
      setActive(loop ? closest - 1 : closest);
    }
  }, [length, loop, scrollToPosition, slides.length]);

  // Initial centering, responsive resize, and user reduced-motion preference.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);

    const center = () => scrollToPosition(physicalRef.current, "instant");
    const frame = window.requestAnimationFrame(center);
    const observer = new ResizeObserver(center);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", updatePreference);
      observer.disconnect();
    };
  }, [scrollToPosition]);

  useEffect(() => () => {
    if (scrollEndRef.current) clearTimeout(scrollEndRef.current);
  }, []);

  const onScroll = () => {
    if (scrollEndRef.current) clearTimeout(scrollEndRef.current);
    scrollEndRef.current = setTimeout(settlePosition, 180);
  };

  const goTo = useCallback((position: number) => {
    if (!loop) return;
    // Selesaikan transisi sebelumnya sebelum memulai navigasi lain.
    if (scrollEndRef.current) clearTimeout(scrollEndRef.current);
    physicalRef.current = position;
    setDisplayIndex(position);
    const real = ((position - 1) % length + length) % length;
    setActive(real);
    scrollToPosition(position, reducedMotion ? "instant" : "smooth");
  }, [length, loop, reducedMotion, scrollToPosition]);

  const step = useCallback((delta: number) => {
    if (!loop) return;
    // Klik cepat setelah slide clone selesai tetap menavigasi secara konsisten.
    if (physicalRef.current === length + 1 && delta > 0) {
      physicalRef.current = 1;
      scrollToPosition(1, "instant");
    } else if (physicalRef.current === 0 && delta < 0) {
      physicalRef.current = length;
      scrollToPosition(length, "instant");
    }
    const next = Math.min(length + 1, Math.max(0, physicalRef.current + delta));
    goTo(next);
  }, [goTo, length, loop, scrollToPosition]);

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
        <div className="kj-carousel-viewport" ref={viewportRef} onScroll={onScroll}>
          {slides.map((story, physicalIndex) => {
            const clone = loop && (physicalIndex === 0 || physicalIndex === slides.length - 1);
            return (
              <div
                key={`${story.slug}-${physicalIndex}`}
                className={`kj-carousel-slide${clone ? " kj-carousel-clone" : ""}${physicalIndex === displayIndex ? " is-current" : ""}`}
                ref={(node) => { slidesRef.current[physicalIndex] = node; }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(loop ? (physicalIndex - 1 + length) % length : physicalIndex) + 1} dari ${length}: ${story.title}`}
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
            <button type="button" key={story.slug} aria-label={`Lihat kisah ${index + 1}: ${story.title}`} aria-current={index === active ? "true" : undefined} className={index === active ? "is-active" : ""} onClick={() => goTo(loop ? index + 1 : 0)}/>
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
