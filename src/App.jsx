import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import OptionWheel from './OptionWheel.jsx';
import Grainient from './Grainient.jsx';

const FlexCarousel = lazy(() => import('./FlexCarousel.jsx'));
const MorphSlider = lazy(() => import('./MorphSlider.jsx'));
const Masonry = lazy(() => import('./Masonry.jsx'));
const TiltedCard = lazy(() => import('./TiltedCard.jsx'));

const asset = (path) => `${import.meta.env.BASE_URL}site-assets/${path.split('/').map(encodeURIComponent).join('/')}`;
const projects = [
  { id: 'sg-client', label: 'SG identity', type: 'Brand identity', description: 'Logo system for a client in Singapore.' },
  { id: 'concept', label: 'Graphic design', type: 'Personal work', description: 'Posters, identity graphics, and portrait concepts.' },
  { id: 'exhibition-one', label: 'Exhibition I', type: 'Photography', description: 'Six photographs from the first exhibition.' },
  { id: 'exhibition-two', label: 'Exhibition II', type: 'Photography & design', description: 'A portrait photograph with two graphic compositions.' },
  { id: 'photography', label: 'Photography', type: 'Personal work', description: 'A selection of six photographs.' },
  { id: 'films', label: 'Short films', type: 'Film', description: 'Four films shot, edited, and color graded by me.' },
  { id: 'zyra', label: 'ZYRA identity', type: 'Concept identity', description: 'Visual identity for a fictional business.' },
];
const wheelItems = ['SG', 'DESIGN', 'EXHIBIT I', 'EXHIBIT II', 'PHOTO', 'FILM', 'ZYRA'];
const filmIds = ['mQo167rulGY', 'yfbhsOqqBUQ', 'CABiI28J0lw', '7QkCCW5J6VY'];
const gallery = {
  concept: [
    ['Concept Graphic Design/Book Cover.png', 'Book Cover Design'],
    ['Concept Graphic Design/Media Club Poster.jpg', 'Media Club Poster'],
    ['Concept Graphic Design/Online Store Logo.jpg', 'Online Store Logo'],
    ['Concept Graphic Design/Portrait Concept 2.jpg', 'Portrait Concept 2'],
    ['Concept Graphic Design/Portrait Concept.jpg', 'Portrait Concept'],
  ],
  first: Array.from({ length: 6 }, (_, index) => [`First Exhibition/${index + 1}.jpg`, `First exhibition / photograph ${String(index + 1).padStart(2, '0')}`]),
  second: [
    ['Second Exhibition/Realistic.png', 'Realistic / photography'],
    ['Second Exhibition/Metaphor.jpg', 'Metaphor / graphic design'],
    ['Second Exhibition/Abstract.jpg', 'Abstract / graphic design'],
  ],
  photo: [
    ['Photography/f17254144.jpg', 'Photography / frame 01'],
    ['Photography/f17279808.jpg', 'Photography / frame 02'],
    ['Photography/f17430464.jpg', 'Photography / frame 03'],
    ['Photography/f20058688.jpg', 'Photography / frame 04'],
    ['Photography/f20366528.jpg', 'Photography / frame 05'],
    ['Photography/f21161856.jpg', 'Photography / frame 06'],
  ],
};
const masonryItems = gallery.concept.map(([src, title], index) => ({
  id: src,
  img: asset(src),
  alt: title,
  title,
  url: '#concept',
  height: [560, 680, 470, 640, 520][index],
}));
const identityVariants = [
  { id: 'red-gold', label: 'Red / gold', colors: ['#e9353e', '#f6c34e'], horizontal: 'SG Client/Horizontal Logo 2.png', vertical: 'SG Client/Vertical Logo 2.png' },
  { id: 'red-green', label: 'Red / green', colors: ['#e84442', '#a5d682'], horizontal: 'SG Client/Horizontal Logo Alt 1.png' },
  { id: 'blue', label: 'Blue', colors: ['#4c64b3', '#fff'], horizontal: 'SG Client/Horizontal Logo Alt 2.png' },
  { id: 'blue-pink', label: 'Blue / pink', colors: ['#4c64b3', '#efa6d1'], horizontal: 'SG Client/Horizontal Logo Alt 3.png', vertical: 'SG Client/Vertical Logo Alt 2.png' },
  { id: 'blue-green', label: 'Blue / green', colors: ['#4c64b3', '#a5d682'], vertical: 'SG Client/Vertical Logo Alt 1.png' },
];

function Lightbox({ selection, onClose, onStep }) {
  const dialogRef = useRef(null);
  const images = selection ? gallery[selection.galleryId] : null;
  const current = images?.[selection?.index];
  useEffect(() => {
    const dialog = dialogRef.current;
    if (selection && dialog && !dialog.open) dialog.showModal();
    else if (!selection && dialog?.open) dialog.close();
  }, [selection]);
  if (!selection || !current) return <dialog ref={dialogRef} className="lightbox" onClose={onClose} aria-label="Image viewer" />;
  return <dialog ref={dialogRef} className="lightbox" onClose={onClose} aria-label="Image viewer" onClick={(event) => { if (event.target === dialogRef.current) onClose(); }} onKeyDown={(event) => {
    if (event.key === 'ArrowLeft') onStep(-1);
    if (event.key === 'ArrowRight') onStep(1);
  }}>
    <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close image viewer">×</button>
    <button type="button" className="lightbox-prev" onClick={() => onStep(-1)} aria-label="Previous image">←</button>
    <figure><img src={asset(current[0])} alt={current[1]} /><figcaption>{current[1]}</figcaption></figure>
    <button type="button" className="lightbox-next" onClick={() => onStep(1)} aria-label="Next image">→</button>
    <span className="lightbox-count">{selection.index + 1} / {images.length}</span>
  </dialog>;
}

export default function App() {
  const [wheelIndex, setWheelIndex] = useState(3);
  const [orientation, setOrientation] = useState('horizontal');
  const [colorway, setColorway] = useState('red-gold');
  const [selection, setSelection] = useState(null);
  const [film, setFilm] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedVariant = identityVariants.find((variant) => variant.id === colorway);
  const availableVariants = identityVariants.filter((variant) => variant[orientation]);
  const shownVariant = selectedVariant?.[orientation] ? selectedVariant : availableVariants[0];
  const openImage = (galleryId, index) => setSelection({ galleryId, index });
  const stepImage = (delta) => setSelection((current) => {
    if (!current) return current;
    const length = gallery[current.galleryId].length;
    return { ...current, index: (current.index + delta + length) % length };
  });
  const chooseOrientation = (value) => {
    setOrientation(value);
    const available = identityVariants.filter((variant) => variant[value]);
    if (!available.some((variant) => variant.id === colorway)) setColorway(available[0].id);
  };
  const goToProject = (index) => document.getElementById(projects[index].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return <>
    <div className="grainient-background" aria-hidden="true"><Grainient color1="#fff1f2" color2="#d50012" color3="#ffffff" timeSpeed={0.18} colorBalance={0.12} warpStrength={0.8} warpFrequency={3.6} warpSpeed={1.1} warpAmplitude={62} blendAngle={18} blendSoftness={0.16} rotationAmount={110} noiseScale={2.2} grainAmount={0.035} grainScale={2} grainAnimated={false} contrast={1.16} gamma={1.02} saturation={0.64} centerX={0} centerY={0} zoom={1.02} lightMode /></div>
    <div className="site-shell">
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Zwe, also known as Kai">Zwe <span>Kai</span></a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>Menu</button>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
        <a href="#sg-client" onClick={() => setMenuOpen(false)}>Work</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      </nav>
    </header>

    <main id="top">
      <section className="intro" aria-labelledby="intro-title">
        <div className="intro-copy">
          <p className="overline">Designer · Creative developer · Thailand</p>
          <h1 id="intro-title">Zwe<span>.</span></h1>
          <p className="intro-text">Also known as Kai. I work across brand identity, graphic design, photography, film, and web development. I’m currently completing a degree in software engineering at Stamford International University.</p>
          <a className="text-link" href="#sg-client">Explore the work <span>↓</span></a>
        </div>
        <aside className="wheel-column" aria-label="Choose a project">
          <div className="wheel-label"><span>Selected work</span><span>{String(wheelIndex + 1).padStart(2, '0')} / 07</span></div>
          <OptionWheel items={wheelItems} defaultSelected={3} onChange={(index) => setWheelIndex(index)} textColor="#aaa8a4" activeColor="#d50012" side="right" fontSize={3} spacing={1.4} curve={1} tilt={6} blur={2} fade={0.25} smoothing={200} inset={80} loop={false} draggable />
          <div className="wheel-caption" aria-live="polite"><span>{projects[wheelIndex].type}</span><p>{projects[wheelIndex].description}</p><button type="button" className="text-link" onClick={() => goToProject(wheelIndex)}>View project <span>↘</span></button></div>
        </aside>
        <div className="intro-bottom"><span>Portfolio 2026</span><span>Scroll to view the work</span></div>
      </section>

      <section id="sg-client" className="project-section section-wrap">
        <div className="section-title"><div><p className="overline">01 · Brand identity</p><h2>SG Client</h2></div><p>Logo design for a client in Singapore.</p></div>
        <div className="identity-layout">
          <div className="identity-stage"><img src={asset(shownVariant[orientation])} alt={`SG Client ${orientation} logo, ${shownVariant.label}`} /></div>
          <div className="identity-controls">
            <div><p className="control-label">Orientation</p><div className="segmented">{['horizontal', 'vertical'].map((value) => <button type="button" key={value} className={orientation === value ? 'active' : ''} aria-pressed={orientation === value} onClick={() => chooseOrientation(value)}>{value}</button>)}</div></div>
            <div><p className="control-label">Available colors <span>{availableVariants.findIndex((variant) => variant.id === shownVariant.id) + 1} / {availableVariants.length}</span></p><div className="swatches">{availableVariants.map((variant) => <button type="button" key={variant.id} className={variant.id === shownVariant.id ? 'swatch active' : 'swatch'} style={{ '--color-a': variant.colors[0], '--color-b': variant.colors[1] }} aria-label={`${variant.label} colorway`} aria-pressed={variant.id === shownVariant.id} onClick={() => setColorway(variant.id)} />)}</div></div>
            <p className="fine-print">Showing the supplied logo artwork.</p>
          </div>
        </div>
      </section>

      <section id="concept" className="project-section section-wrap">
        <div className="section-title"><div><p className="overline">02 · Personal work</p><h2>Graphic design</h2></div><p>Posters, identity graphics, and portrait concepts.</p></div>
        <div className="masonry-gallery"><Suspense fallback={<div className="gallery-loading">Loading graphic design work…</div>}><Masonry items={masonryItems} ease="power3.out" duration={0.6} stagger={0.06} animateFrom="bottom" scaleOnHover blurToFocus colorShiftOnHover={false} onItemClick={(item) => openImage('concept', gallery.concept.findIndex(([src]) => src === item.id))} /></Suspense></div>
      </section>

      <section id="exhibition-one" className="project-section section-wrap">
        <div className="section-title"><div><p className="overline">03 · Photography</p><h2>First exhibition</h2></div><p>Six photographs, shown in the supplied order.</p></div>
        <div className="flex-gallery"><Suspense fallback={<div className="gallery-loading">Loading exhibition photographs…</div>}><FlexCarousel items={gallery.first.map(([src, label]) => ({ src: asset(src), alt: label, title: label, subtitle: 'First Exhibition' }))} preset="liquid" intro="rise" fit="natural" cardHeight={0.62} gap={14} squeeze={0.18} focusOnClick autoplay={false} captions /></Suspense></div>
      </section>

      <section id="exhibition-two" className="project-section section-wrap">
        <div className="section-title"><div><p className="overline">04 · Photography & design</p><h2>Second exhibition</h2></div><p>A portrait photograph with two graphic compositions.</p></div>
        <div className="tilted-gallery">{gallery.second.map(([src, label], index) => <div className="tilted-item" key={src}><Suspense fallback={<div className="tilted-loading" />}><TiltedCard imageSrc={asset(src)} altText={label} captionText={label.split(' / ')[0]} containerHeight="clamp(300px, 38vw, 430px)" containerWidth="100%" imageWidth="min(100%, 320px)" imageHeight="min(100%, 420px)" scaleOnHover={1.035} rotateAmplitude={7} showMobileWarning={false} showTooltip={false} onClick={() => openImage('second', index)} /></Suspense><p className="tilted-item-caption">{label.split(' / ')[0]}</p></div>)}</div>
      </section>

      <section id="photography" className="project-section section-wrap">
        <div className="section-title"><div><p className="overline">05 · Personal work</p><h2>Photography</h2></div><p>A selection of six photographs.</p></div>
        <div className="morph-gallery"><Suspense fallback={<div className="gallery-loading">Loading photographs…</div>}><MorphSlider items={gallery.photo.map(([src, caption]) => ({ image: asset(src), caption }))} transition="melt" intensity={0.48} scale={1.4} aberration={0.2} drift={0.12} autoplay={false} radius={0} overlayColor="#ffffff" showCaptions showControls showIndicators /></Suspense></div>
      </section>

      <section id="films" className="project-section section-wrap">
        <div className="section-title"><div><p className="overline">06 · Film</p><h2>Short films</h2></div><p>Shot, edited, and color graded by me.</p></div>
        <div className="film-layout"><div className="film-player"><iframe key={film} src={`https://www.youtube.com/embed/${filmIds[film - 1]}?rel=0`} title={`Film ${String(film).padStart(2, '0')}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen loading="lazy" /></div><div className="film-list" aria-label="Choose a film">{filmIds.map((_, index) => { const number = index + 1; return <button type="button" key={number} className={film === number ? 'active' : ''} aria-pressed={film === number} onClick={() => setFilm(number)}><span>Film {String(number).padStart(2, '0')}</span><span>↗</span></button>; })}</div></div>
      </section>

      <section id="zyra" className="project-section section-wrap">
        <div className="section-title"><div><p className="overline">07 · Visual identity</p><h2>ZYRA Studio</h2></div><p>A studio identity concept built around “Design. Develop. Grow.”</p></div>
        <div className="zyra-banner"><img src={asset('ZYRA Concept Design/Banner - White.jpg')} alt="ZYRA Studio identity banner: Design. Develop. Grow." loading="lazy" /></div>
        <div className="zyra-systems">{[
          ['Horizontal lockup', 'Horizontal - Black.jpg', 'Horizontal - White.jpg'],
          ['Wordmark', 'Word Mark - Black.jpg', 'Word Mark - White.jpg'],
          ['Symbol', 'Logo Mark - Black.jpg', 'Logo Mark - White.jpg'],
          ['Monogram', 'Monogram - Black.jpg', 'Monogram - White.jpg']
        ].map(([label, blackFile, whiteFile]) => <figure className="zyra-system" key={label}>
          <figcaption>{label}</figcaption>
          <div className="zyra-variants">
            <div className="zyra-variant zyra-variant-light"><img src={asset(`ZYRA Concept Design/${blackFile}`)} alt={`${label}, black artwork on white`} loading="lazy" /></div>
            <div className="zyra-variant zyra-variant-dark"><img src={asset(`ZYRA Concept Design/${whiteFile}`)} alt={`${label}, white artwork on black`} loading="lazy" /></div>
          </div>
        </figure>)}</div>
      </section>

      <section id="about" className="about-section section-wrap">
        <div className="section-title"><div><p className="overline">About</p><h2>A little about me</h2></div></div>
        <div className="about-layout"><p>Zwe, also known as Kai, is a final-semester software engineering student at Stamford International University in Thailand. Kai works independently across graphic design, brand identity, photography, video, color grading, and websites.</p><dl><div><dt>Based in</dt><dd>Thailand · GMT+7</dd></div><div><dt>Studying</dt><dd>Software engineering</dd></div><div><dt>Available for</dt><dd>Freelance projects</dd></div></dl></div>
      </section>

      <footer id="contact" className="site-footer section-wrap"><div><p className="overline">Contact</p><h2>Have a project in mind?</h2><p>For branding, design, photography, film, and web projects.</p><a className="email-link" href="mailto:kaichanning69@gmail.com">kaichanning69@gmail.com ↗</a></div><div className="footer-bottom"><span>Zwe (Kai) · 2026</span><a href="#top">Back to top ↑</a></div></footer>
    </main>
    <Lightbox selection={selection} onClose={() => setSelection(null)} onStep={stepImage} />
    </div>
  </>;
}
