import { HeroSection } from "../components/LandingPage/v2/LandingPageHero";
import { FeatureSection, AboutUsSection, RegistrationProcessSection, MultiSection, AllBuildersWelcomeSection, IdeasWelcomeSection  } from "../components/LandingPage/v2/LandingPageSections";
import { PricingSection } from "@/components/LandingPage/v2/PricingSection";

// export async function getStaticProps() {

//   // const image = await fetch('https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fhero_1024x1024.webp?alt=media&token=a3517608-7021-40ba-b937-1201f4e94c61');


//   return {
//     props: {
//       // image: image.blob(),
//     },
//     revalidate: 60,
//   };
// };

function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <AboutUsSection />
      <RegistrationProcessSection />
      <MultiSection />
      <AllBuildersWelcomeSection />
      <IdeasWelcomeSection />
      <PricingSection />
    </div>
  );
}

export default LandingPage;
