import { HomeExperience } from '@/components/home/HomeExperience';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeSections } from '@/components/home/HomeSections';
import styles from '@/components/home/home.module.css';

export default function HomePageV2() {
  return (
    <HomeExperience className={styles.home}>
      <HomeHero />
      <HomeSections />
    </HomeExperience>
  );
}
