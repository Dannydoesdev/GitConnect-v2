import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { app, auth } from '@/firebase/clientApp';
import { Button, Group, Space } from '@mantine/core';
// import { getPremiumStatus } from '@/lib/stripe/getPremiumStatusTest';
// import { getCheckoutUrl, getPortalUrl } from '@/lib/stripe/stripePaymentTest';
import { getPremiumStatusProd } from '@/lib/stripe/getPremiumStatusProd';
import { getCheckoutUrl, getPortalUrl } from '@/lib/stripe/stripePaymentProd';
import { PricingSection } from '@/components/LandingPage/v2/PricingSection';
import { PremiumPanel } from '@/components/SubscriptionComponents/PremiumPanel';
import { StandardPanel } from '@/components/SubscriptionComponents/StandardPanel';
import { HeroSection } from '../components/LandingPage/v2/LandingPageHero';
import {
  AboutUsSection,
  AllBuildersWelcomeSection,
  FeatureSection,
  IdeasWelcomeSection,
  MultiSection,
  RegistrationProcessSection,
} from '../components/LandingPage/v2/LandingPageSections';

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
  const { userData, currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);
    // const checkPremium = async () => {
    // const newPremiumStatus = auth.currentUser ? await getPremiumStatus(app) : false;
    // const newPremiumStatus = userData ? userData.isPro : false;
    // setIsPro(newPremiumStatus);
    // };
    // checkPremium();
  }, [app, userData]);

  // useEffect(() => {
  //   const checkPremium = async () => {
  //     // const newPremiumStatus = auth.currentUser ? await getPremiumStatus(app) : false;
  //     const newPremiumStatus = userData ? userData.isPro : false;
  //     setIsPro(newPremiumStatus);
  //   };
  //   checkPremium();
  // }, [app, userData]);

  const upgradeToPremium = async () => {
    // const priceId = 'price_1O6NBtCT5BNNo8lFdMWZfRgO';
    // const priceId = 'price_1O7gfFCT5BNNo8lFNzj4c76Y';
    const priceId = 'price_1O80UbCT5BNNo8lF98l4hlov';

    const checkoutUrl = await getCheckoutUrl(app, priceId);
    // console.log(checkoutUrl);
    router.push(checkoutUrl);
    // console.log('Upgrade to Premium');
  };

  const upgradeToPremiumButton = (
    <Button onClick={upgradeToPremium} variant="default" radius="lg" size="lg">
      Upgrade To Premium
    </Button>
  );

  const manageSubscription = async () => {
    const portalUrl = await getPortalUrl(app);
    router.push(portalUrl);
    console.log('Manage Subscription');
  };

  const managePortalButton = (
    <Button onClick={manageSubscription} variant="default" radius="lg" size="lg">
      Manage Subscription
    </Button>
  );

  const statusPanel = isPro ? <PremiumPanel /> : <StandardPanel />;
  const memberButton = isPro ? managePortalButton : upgradeToPremiumButton;

  return (
    <div>
      <HeroSection />
      <Group position="center">
        {statusPanel}
        {memberButton}
        {/* <Button onClick={upgradeToPremium} variant="default" radius="lg" size="lg">
          Upgrade To Premium
        </Button> */}
      </Group>
      <Space h="lg" />
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

// From the vid:

// const upgradeToPremiumButton = (
//   <button
//     onClick={upgradeToPremium}
//     className="bg-blue-600 p-4 px-6 text-lg rounded-lg hover:bg-blue-700 shadow-lg"
//   >
//     <div className="flex gap-2 items-center align-middle justify-center">
//       Upgrade To Premium
//     </div>
//   </button>
// );

// const managePortalButton = (
//   <button
//     onClick={manageSubscription}
//     className="bg-blue-600 p-4 px-6 text-lg rounded-lg hover:bg-blue-700 shadow-lg"
//   >
//     <div className="flex gap-2 items-center align-middle justify-center">
//       Manage Subscription
//     </div>
//   </button>
// );
