import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import TrustBadges from '../components/home/TrustBadges';
import PromoBanner from '../components/home/PromoBanner';
import BestSellers from '../components/home/BestSellers';

const Home = () => {
  return (
    <div>
      <HeroBanner />
      <CategoryGrid />
      <TrustBadges />
      <PromoBanner />
      <BestSellers />
    </div>
  );
};

export default Home;
