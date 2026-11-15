"use client";

import Link from "next/link";
import { useState } from "react";
import type { Competition } from "@/lib/types";
import { posterSources } from "./poster-sources";

// Variasi terbatas untuk membedakan sampul tanpa mengubah identitas Jejakarsa.
const categoryTones: Record<string, string> = {
  "Inovasi & Teknologi": "sage",
  "Riset & Karya Tulis": "blue",
  "Desain & UI/UX": "lilac",
  "Bisnis & Kewirausahaan": "clay",
  "Pemrograman": "blue",
  "Esai & Karya Tulis": "sage",
};

export function OpportunityGridPoster({ competition }: { competition: Competition }) {
  const dataPoster = (competition as Competition & { posterUrl?: string }).posterUrl;
  const candidateUrl = (dataPoster || posterSources[competition.slug] || "").trim();
  const imageUrl = /^(https?:\/\/|\/(?!\/))/.test(candidateUrl) ? candidateUrl : "";
  const [failedUrl, setFailedUrl] = useState("");
  const hasPoster = Boolean(imageUrl) && failedUrl !== imageUrl;
  const tone = categoryTones[competition.category] ?? "sage";
  const titleLength = competition.title.length;
  const lengthClass = titleLength > 68 ? "is-extra-long" : titleLength > 40 ? "is-long" : "";

  return (
    <Link
      href={`/opportunities/${competition.slug}`}
      className="explore-grid-poster-link"
      aria-label={`Buka detail ${competition.title}`}
    >
      <div className={`explore-grid-poster ${hasPoster ? "has-original" : `tone-${tone}`}`}>
        {hasPoster ? (
          // img biasa agar URL penyelenggara dapat digunakan tanpa mengubah next.config.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="explore-grid-poster-original"
            src={imageUrl}
            alt={`Poster ${competition.title}`}
            loading="lazy"
            decoding="async"
            onError={() => setFailedUrl(imageUrl)}
          />
        ) : (
          <div className={`explore-grid-generated ${lengthClass}`} aria-hidden="true">
            <div className="explore-grid-generated-decor"/>
            <div className="explore-grid-generated-head"><span>J.</span><span>JEJAKARSA / KATALOG</span></div>
            <div className="explore-grid-generated-center">
              <span className="explore-grid-generated-category">{competition.category}</span>
              <strong>{competition.title}</strong>
              <span className="explore-grid-generated-organizer">{competition.organizer}</span>
            </div>
            <div className="explore-grid-generated-foot"><span>SAMPUL KATALOG</span><span>BUKAN POSTER RESMI</span></div>
          </div>
        )}
      </div>
    </Link>
  );
}
