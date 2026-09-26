'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Check, GraduationCap, Languages, Pause, Play } from 'lucide-react';
import styles from './courses.module.css';

export interface CourseVisualItem {
  id: string;
  name: string;
  examCount: number;
  testCount: number;
  language: string;
  examTitles: string[];
}

export function CourseCatalogVisual({ courses }: { courses: CourseVisualItem[] }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const scene = useRef<HTMLDivElement>(null);
  const syncPlayback = useRef<(() => void) | null>(null);
  const pausedByUser = useRef(false);
  const current = courses[selected] ?? courses[0];

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);

  useEffect(() => {
    pausedByUser.current = paused;
    syncPlayback.current?.();
  }, [paused]);

  // A quick, independent "pop" whenever the previewed course changes — separate
  // from the entrance/drift tweens above (it only touches scale, so it can't
  // conflict with their rotation/y control) and from the CSS fade on the
  // content itself, so switching courses always reads as a deliberate change.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = scene.current;
    if (!element) return;
    const book = element.querySelector(`.${styles.book}`);
    const syllabus = element.querySelector(`.${styles.syllabus}`);
    const targets = [book, syllabus].filter(Boolean);
    if (!targets.length) return;
    gsap.fromTo(targets, { scale: 0.96 }, { scale: 1, duration: 0.55, ease: 'back.out(2.4)', stagger: 0.07, overwrite: 'auto' });
  }, [current?.id]);

  // Entrance reveal + a slow continuous drift on the book and syllabus card —
  // the same GSAP pattern the home hero's card deck uses, scaled to this scene.
  useLayoutEffect(() => {
    const element = scene.current;
    if (!element) return;
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(element);
      const halo = select('[data-visual-halo]');
      const book = select('[data-visual-book]');
      const syllabus = select('[data-visual-syllabus]');

      const entrance = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      entrance
        .from(halo, { scale: 0.82, opacity: 0, duration: 1.6 }, 0)
        .from(book, { x: 60, opacity: 0, rotation: -14, transformOrigin: 'center', duration: 1.3, ease: 'power4.out' }, 0.2)
        .from(syllabus, { x: 50, y: 30, opacity: 0, rotation: 12, transformOrigin: 'center', duration: 1.2, ease: 'back.out(1.3)' }, 0.55);

      // Floats are only created once the entrance has fully finished — creating
      // them earlier (even paused) lets GSAP's overwrite manager treat them as an
      // immediate conflict with the entrance's own rotation/y tweens on the same
      // elements, which snapped the book into place right as the reveal ended.
      let floats: gsap.core.Tween[] = [];
      let inView = false;
      let hovered = false;
      let entered = false;
      const update = () => {
        const stopped = !inView || document.hidden || pausedByUser.current;
        entrance.paused(stopped);
        const still = stopped || !entered || hovered;
        floats.forEach((float) =>
          gsap.to(float, { timeScale: still ? 0 : 1, duration: still ? 0.6 : 1.2, ease: 'power2.out', overwrite: true })
        );
      };
      entrance.eventCallback('onComplete', () => {
        gsap.set([...halo, ...book, ...syllabus], { clearProps: 'opacity' });
        entered = true;
        floats = [
          gsap.to(book, { y: -10, rotation: -5, repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 5, force3D: true }),
          gsap.to(syllabus, { y: -8, rotation: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 6, delay: 0.6, force3D: true }),
        ];
        floats.forEach((float) => float.timeScale(0));
        update();
      });
      const onPointerEnter = () => { hovered = true; update(); };
      const onPointerLeave = () => { hovered = false; update(); };
      const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
      syncPlayback.current = update;
      observer.observe(element);
      document.addEventListener('visibilitychange', update);
      element.addEventListener('pointerenter', onPointerEnter);
      element.addEventListener('pointerleave', onPointerLeave);

      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', update);
        element.removeEventListener('pointerenter', onPointerEnter);
        element.removeEventListener('pointerleave', onPointerLeave);
        syncPlayback.current = null;
      };
    }, element);

    return () => media.revert();
  }, []);

  return (
    <div className={styles.visual} ref={scene} data-motion-paused={paused || !visible}>
      <div className={styles.bookScene}>
        <div className={styles.visualHalo} data-visual-halo aria-hidden="true" />
        <div className={styles.visualRule} aria-hidden="true"><span>THE EXAMREADY COLLECTION</span><i /></div>
        <div className={styles.bookBack} aria-hidden="true" />
        <div className={styles.bookFloat} data-visual-book>
          <div className={styles.book}>
            <div className={styles.bookTop}><GraduationCap size={23} /><span>EXAMREADY<br /><b>PREPARATION SERIES</b></span><span className={styles.bookEdition}>01 /</span></div>
            <div className={styles.bookContent} key={current?.id ?? 'empty'}>
              <span className={styles.bookKicker}>YOUR NEXT CHAPTER</span>
              <h2>{current?.name ?? 'A world of possibilities.'}</h2>
              <p>Small steps.<br />Serious preparation.</p>
              <div className={styles.bookArtwork} aria-hidden="true">
                <div className={styles.artRing} /><div className={styles.artRingTwo} />
                <ArrowUpRight strokeWidth={1} />
                <span className={styles.artLabel}>START HERE.<br />GO FURTHER.</span>
              </div>
              <div className={styles.bookBottom}><span>EXAM-FOCUSED PRACTICE</span><BookOpen size={19} /></div>
            </div>
          </div>
        </div>
        <div className={styles.syllabusPosition} data-visual-syllabus>
          <div className={styles.syllabus}>
            <div className={styles.syllabusTop}><span className={styles.smallIcon}><BookOpen size={16} /></span><span>Inside your course</span><ArrowUpRight size={17} /></div>
            <div className={styles.syllabusBody} key={current?.id ?? 'empty'}>
              <div className={styles.syllabusCounts}><div><strong>{current?.examCount ?? '—'}</strong><span>exams</span></div><div><strong>{current?.testCount ?? '—'}</strong><span>practice sets</span></div></div>
              <p><Languages size={14} />{current?.language ?? 'Explore available courses'}</p>
              <div className={styles.syllabusCheck}><Check size={13} /><span>Practice. Review. Improve.</span></div>
            </div>
            <Link className={styles.syllabusLink} href={current ? `/student/mock-tests?category=${encodeURIComponent(current.id)}` : '#courses'}>Explore this course <ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <div className={styles.visualFootnote}><span className={styles.tinyDot} /> A focused start to a bigger future.</div>
      </div>
      <div className={styles.visualControls}>
        <div className={styles.coursePicker} aria-label="Preview a course">
          {courses.slice(0, 4).map((course, index) => <button key={course.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{course.name}</button>)}
        </div>
        <button className={styles.motionButton} type="button" aria-label={paused ? 'Resume decorative animation' : 'Pause decorative animation'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>
      </div>
    </div>
  );
}
