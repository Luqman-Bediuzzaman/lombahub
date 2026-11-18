const steps = [
  { number: "01", title: "Temukan", description: "Cari lomba berdasarkan bidang dan minatmu." },
  { number: "02", title: "Periksa", description: "Baca persyaratan dan lihat sumber informasinya." },
  { number: "03", title: "Pilih", description: "Bandingkan biaya, tenggat, dan kebutuhan peserta." },
  { number: "04", title: "Siapkan", description: "Simpan lomba dan catat persiapan pendaftarannya." },
];

export function ParticipationSteps() {
  return (
    <ol className="participation-steps" aria-label="Langkah mengikuti lomba">
      {steps.map((step) => (
        <li className="participation-step" key={step.number}>
          <span className="participation-step-number" aria-hidden="true">{step.number}</span>
          <div><h3>{step.title}</h3><p>{step.description}</p></div>
        </li>
      ))}
    </ol>
  );
}
