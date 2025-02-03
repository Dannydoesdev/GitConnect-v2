import { useCallback, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import Router from 'next/router';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { app, auth } from '@/firebase/clientApp';
import { Dialog, Disclosure, RadioGroup } from '@headlessui/react';
import {
  ArrowPathIcon,
  CheckIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  EyeIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
  SparklesIcon,
  StarIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';
import {
  Bars3Icon,
  ClockIcon,
  MinusSmallIcon,
  PlusSmallIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  Box,
  Button,
  createStyles,
  Flex,
  Group,
  Overlay,
  rem,
  Space,
} from '@mantine/core';
import { IconBrandDiscord, IconBrandGithub } from '@tabler/icons-react';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import mixpanel from 'mixpanel-browser';
import { getCheckoutUrl } from '@/lib/stripe/stripePaymentProd';
import { getCheckoutUrlTest } from '@/lib/stripe/stripePaymentTest';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
];

const useStyles = createStyles((theme) => ({
  iconDiscord: {
    marginRight: '8px',
  },

  buttonLinktree: {
    marginLeft: '95px',
    [theme.fn.smallerThan('md')]: {
      marginLeft: '0px',
      maxWidth: '100%',
      fontSize: rem(14),
    },
  },

  buttonDiscord: {
    [theme.fn.smallerThan('md')]: {
      marginLeft: '0px',
      maxWidth: '100%',
      fontSize: rem(14),
    },
  },
  hero: {
    paddingTop: 10,
    position: 'relative',
    // backgroundImage: 'url(../../img/gitconnect.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
}));

const features = [
  {
    name: 'Your code, visualised.',
    description:
      'We aim to bridge the gap between the efficiency of visual communication, and the complexity of coding, by translating your code into a compelling visual narrative, doing justice to the amount of commits you put in to it.',
    href: '#',
    icon: StarIcon,
  },
  {
    name: 'More than a portfolio, a community.',
    description:
      'Your GitConnect portfolio is yours to edit and share - a home within a home - surrounded by the GitConnect community & connecting you with a network of peers for inspiration and collaboration.',
    href: '#',
    icon: UserGroupIcon,
  },
  {
    name: 'Nurture potential, spark innovation.',
    description:
      'Our mission at GitConnect is to foster and fuel innovation by providing a creative platform for all developers, from beginners to experts, to share and bring their projects to life.',
    href: '#',
    icon: SparklesIcon,
  },
];

interface Pricing {
  frequencies: pricingFrequency[];
  tiers: pricingTier[];
}

// Define the possible keys for frequency values
type Frequency = 'monthly' | 'annually';

type pricingTier = {
  name: string;
  id: string;
  href: string;
  button: string;
  // price: Record<Frequency, string>;
  // discountedPrice?: Record<Frequency, string>;
  price: {
    monthly: string;
    annually: string;
  };
  discountedPrice?: {
    monthly: string;
    annually: string;
  };
  description: string;
  features: pricingFeature[];
  // features: string[];
  mostPopular: boolean;
};
type pricingFeature = {
  description: string;
  comingSoon?: boolean;
};

type pricingFrequency = {
  value: string;
  label: string;
  priceSuffix: string;
};

const pricing: Pricing = {
  frequencies: [
    { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
    { value: 'annually', label: 'Annually', priceSuffix: '/year' },
  ],
  tiers: [
    {
      name: 'Basic',
      id: 'tier-basic',
      href: '/signup',
      button: 'Sign Up',
      price: { monthly: '$0', annually: '$0' },
      description: 'The essentials to build your portfolio with GitConnect.',
      features: [
        { description: '3 projects', comingSoon: false },
        { description: 'Shareable portfolio', comingSoon: false },
        { description: 'Access the Discord', comingSoon: false },
        { description: 'Basic Support', comingSoon: false },
        { description: 'Basic analytics', comingSoon: true },
        { description: 'Basic AI integration', comingSoon: true },
      ],
      mostPopular: false,
    },
    {
      name: 'GitConnect Pro',
      id: 'tier-pro',
      href: '#',
      button: 'Buy Now',
      description: 'Build the ultimate portfolio with GitConnect.',
      price: { monthly: '15', annually: '150' },
      discountedPrice: { monthly: '7', annually: '70' },
      features: [
        // { description: 'Everything in Basic plus:', comingSoon: false },
        { description: 'Unlimited projects', comingSoon: false },
        { description: 'Influence the roadmap', comingSoon: false },
        { description: 'Get featured more often', comingSoon: false },
        { description: 'Priority support', comingSoon: false },
        { description: 'Add blogs', comingSoon: true },
        { description: 'Advanced AI integration', comingSoon: true },
        { description: 'Custom URL', comingSoon: true },
        { description: 'Featured Devs Board', comingSoon: true },
        { description: 'Video integration', comingSoon: true },
      ],
      mostPopular: true,
    },
    {
      name: 'Freelancer - Coming soon',
      id: 'tier-freelancer',
      button: 'Join Discord for updates',
      href: 'https://discord.gg/hkajEH6WkW',
      price: { monthly: 'TBA', annually: 'TBA' },
      description: 'Start or accelerate your business with GitConnect.',
      features: [
        { description: 'Remove GitConnect branding', comingSoon: true },
        { description: 'Paid project board', comingSoon: true },
        { description: 'Invoice generator', comingSoon: true },
        { description: 'Contract templates', comingSoon: true },
        { description: 'Client management', comingSoon: true },
      ],
      mostPopular: false,
    },
  ],
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function LandingPage() {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [frequency, setFrequency] = useState(pricing.frequencies[0]);

  const { userData, currentUser } = useContext(AuthContext);

  // const { currentUser } = useContext(AuthContext)
  const Router = useRouter();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);
  }, [userData]);

  const upgradeToPremiumMonthly = async () => {
    const priceId = 'price_1O8cptCT5BNNo8lFuDcGOAcM';
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    Router.push(checkoutUrl);
  };
  const upgradeToPremiumAnnual = async () => {
    const priceId = 'price_1O8cq0CT5BNNo8lFWd3e5TYy';
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    Router.push(checkoutUrl);
  };

  const signupHandler = useCallback(
    async (e: any) => {
      e.preventDefault();
      const provider = new GithubAuthProvider();

      try {
        // Attempt popup OAuth
        await signInWithPopup(auth, provider).then((result) => {
          const credential: any = GithubAuthProvider.credentialFromResult(result);
          const user = result.user;
          const userId = user.uid;

          if (process.env.NODE_ENV === 'development') {
            // mixpanel.init('13152890549909d8a9fe73e4daf06e43', { debug: true });
            // mixpanel.identify(userId);
            // mixpanel.track('Signed In', {
            //   'Signup Type': 'GitHub',
            // });
          } else {
            mixpanel.init('13152890549909d8a9fe73e4daf06e43', { debug: false });
            mixpanel.identify(userId);

            mixpanel.track('Signed up', {
              'Signup Type': 'GitHub',
            });
          }
        });
      } catch (error) {
        console.log(error);
        // alert(error)
      } finally {
        Router.push('/addproject');
      }
    },
    [Router]
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { classes, cx, theme } = useStyles();

  return (
    // <div className="bg-white">
    <div className="bg-gray-900">
      <main>
        {/* Hero section */}
        <div className="relative isolate overflow-hidden bg-gray-900 pb-16 pt-14 sm:pb-20">
          {/* <img
            // src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
            src="/img/gitconnect.webp"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          /> */}
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              {/* </div>  */}
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  Show the world what you’re building
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  GitConnect is a dedicated platform for developers to build their
                  portfolio, connect with opportunities, and with each other.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/signup" passHref legacyBehavior>
                    <Button
                      component="a"
                      variant="gradient"
                      gradient={{ from: 'indigo', to: 'cyan' }}
                      radius="lg"
                      size="lg"
                    >
                      Start your portfolio
                    </Button>
                  </Link>
                  <Link href="/" passHref legacyBehavior>
                    <Button component="a" variant="default" radius="lg" size="lg">
                      Explore Projects
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="bg-gray-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-400">
                Share your new portfolio in 10 minutes
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Create your developer portfolio in minutes, not days.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Link GitConnect with GitHub to effortlessly create and share a
                personalised portfolio of your work.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                      <feature.icon
                        className="h-5 w-5 flex-none text-indigo-400"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* DANNYS SECTION */}

        <div className="relative bg-gray-900 pt-48 pb-60">
          <div className="mx-auto flex max-w-7xl flex-col-reverse md:flex-col-reverse lg:flex-row items-center gap-y-10 px-6 md:gap-y-8 lg:px-8 xl:items-stretch">
            {/* Danny's Introduction and CTA */}
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto lg:px-16 md:px-6 xl:px-16 xl:py-24">
              <h1 className="text-4xl font-bold text-white">
                Hi, I'm Danny - founder of GitConnect
              </h1>
              <p className=" italic mt-4 text-lg text-white">
                Devs are capable of incredible things, and our goal is to give you a place
                to share whatever your ‘incredible thing’ might be. Whether you are a
                budding developer looking to create a professional presence online or a
                seasoned software engineer wanting to showcase your magnum opus -
                GitConnect is for you.
                {/* Ever had a family member or significant other ask what you actually do for work, and haven't been able to provide a satisfying answer? Now you can show them GitConnect. */}
              </p>
              <Link href="/portfolio/dannydoesdev" passHref legacyBehavior>
                <Button
                  className="bg-white rounded-full text-gray-90 transition-colors"
                  component="a"
                  size="lg"
                  // variant='outline'
                  radius="md"
                  variant="white"
                  color="dark"
                  // leftIcon={<IconBrandGithub size={18} />}

                  // color='white'
                  mt={40}
                  sx={(theme) => ({
                    // leftIcon: {
                    //   marginRight: theme.spacing.lg,
                    // },
                    // '&:hover': {
                    //   backgroundColor: theme.colors.dark[6],
                    // },

                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'black',
                      // border: '1px solid white',
                    },

                    width: '40%',

                    [theme.fn.smallerThan('sm')]: {
                      width: '70%',
                    },
                  })}
                  styles={(theme) => ({
                    leftIcon: {
                      // paddingRight: '20px',
                    },
                  })}
                  // className={classes.control}
                >
                  {/* Create your portfolio in minutes, not days. */}
                  Danny's Portfolio
                </Button>
              </Link>
              {/* <button  className="mt-6 px-8 py-2 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors">
                Danny's Portfolio
            </button> */}
            </div>

            {/* Danny's Image */}
            <div className="w-full max-w-md xl:w-80 xl:flex-none mt-8 h-96 md:h-80 xl:h-auto">
              <div className="relative h-full md:-mx-8 xl:mx-0">
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                  src="https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe"
                  alt="Danny's Image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* NEW PRICING SECTION */}
        {/* NOTE: Nested comments created using cmd + alt + '/' - nestedcomments ext  */}

    {/*   
       <>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              A plan for &nbsp;every&nbsp; dev. <br />
              <br />
              Lock in a launch discount and help shape the future of GitConnect.{' '}
              /~ Pricing plans for teams of&nbsp;all&nbsp;sizes ~/
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
            Our aim is make GitConnect the best platform possible for devs. <br />
            For helping us to achieve that goal, pro users will get a chance to influence the
            roadmap and have a say in what features we build next - especially early on.
            /~ We want every dev to be able to get a great portfolio with GitConnect, your feedback is . ~/
            /~ can support us just by using the platform and providing feedback. ~/
            /~ Choose an affordable plan that’s packed with the best features for engaging
            your audience, creating customer loyalty, and driving sales. ~/
          </p>
          <div className="mt-16 flex justify-center">
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white"
            >
              <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
              {pricing.frequencies.map((option) => (
                <RadioGroup.Option
                  key={option.value}
                  value={option}
                  className={({ checked }) =>
                    classNames(
                      checked ? 'bg-indigo-500' : '',
                      'cursor-pointer rounded-full px-2.5 py-1'
                    )
                  }
                >
                  <span>{option.label}</span>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>

          <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-white/5 ring-2 ring-indigo-500'
                    : 'ring-1 ring-white/10',
                  'rounded-3xl p-8 xl:p-10'
                )}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h2 id={tier.id} className="text-lg font-semibold leading-8 text-white">
                    {tier.name}
                  </h2>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                      Launch Deal
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
                /~ ... other tier details ... ~/
                <p className="mt-6 flex items-baseline gap-x-1">
                  /~ Check if the tier is "Pro" and apply discounts ~/
                  {tier.name.includes('Pro') ? (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-gray-300 line-through">
                        /~ ${tier.price[frequency.value]}{' '} ~/
                        ${tier.price[frequency.value as 'monthly' | 'annually']}{' '}

                        /~ Assuming this is the original price ~/
                      </span>
                      <span className="ml-2 text-4xl font-bold tracking-tight text-white">
                        /~ ${tier.discountedPrice[frequency.value]}{' '} ~/

                        ${tier.discountedPrice && tier.discountedPrice[frequency.value as 'monthly' | 'annually']}{' '} 
               
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-300">
                        {frequency.priceSuffix}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-white">
                          /~ {tier.price[frequency.value]} ~/
                          {tier.price[frequency.value as 'monthly' | 'annually']}{' '}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-300">
                        {frequency.priceSuffix}
                      </span>
                    </>
                  )}
                </p>
                {tier.name.includes('Pro') ? (
                  currentUser ? (
                    frequency?.value === 'annually' ? (
                      <a
                        //  href={tier.href}
                        onClick={() => upgradeToPremiumAnnual()}
                        aria-describedby={tier.id}
                        className={
                          // 'no-underline' +
                          classNames(
                            tier.mostPopular
                              ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                              : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                            'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                          )
                        }
                      >
                        {tier.button}
                      </a>
                    ) : (
                      frequency?.value === 'monthly' && (
                        <a
                          //  href={tier.href}
                          onClick={() => upgradeToPremiumMonthly()}
                          aria-describedby={tier.id}
                          className={
                            // 'no-underline' +
                            classNames(
                              tier.mostPopular
                                ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                                : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                              'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                            )
                          }
                        >
                          {tier.button}
                        </a>
                      )
                    )
                  ) : (
                    <a
                      href="/login"
                      aria-describedby={tier.id}
                      className={
                        // 'no-underline' +
                        classNames(
                          tier.mostPopular
                            ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                            : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                          'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                        )
                      }
                    >
                      Login or Signup to buy
                    </a>
                  )
                ) : (
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className={
                      // 'no-underline' +
                      classNames(
                        tier.mostPopular
                          ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                          : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                        'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                      )
                    }
                  >
                    {tier.button}
                  </a>
                )}
                <div className="text-center gap-2 mt-8 text-sm text-gray-400">
                  <ClockIcon
                    className="inline-block h-4 w-4 mr-1 text-blue-300 align-text-bottom"
                    aria-hidden="true"
                  />
                  = Feature planned / coming soon
                </div>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
                >
                  /~ Conditional rendering for the heading ~/
                  {tier.name.includes('Basic') && (
                    <p className="text-md font-bold uppercase my-4">Includes:</p>
                  )}
                  {tier.name.includes('Pro') && (
                    <p className="text-md font-bold uppercase my-4">
                      Everything in Basic, plus:
                    </p>
                  )}
                  {tier.name.includes('Freelancer') && (
                    <p className="text-md font-bold uppercase my-4">
                      Everything in Pro, plus:
                    </p>
                  )}
                  {tier.features.map((feature) => (
                    <li key={feature.description} className="flex gap-x-3 items-center">
                      {!feature.comingSoon ? (
                        <CheckIcon
                          className="h-6 w-5 flex-none text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <ClockIcon
                          className="h-4 w-5 flex-none text-blue-300"
                          aria-hidden="true"
                        />
                      )}
                      {feature.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Group position="center" mx="xl" pb="md" mt={80}>
          <Link href="#" passHref legacyBehavior>
            <Button
              // px='xl'
              color="dark"
              variant="white"
              // compact={true}
              component="a"
              size="xl"
              radius="lg"
              // w='10%'
              onClick={(e) => {
                signupHandler(e);
              }}
              leftIcon={<IconBrandGithub size={18} />}
              sx={(theme) => ({
                border:
                  theme.colorScheme === 'dark' ? '1px solid black' : '1px solid black',

                backgroundColor: theme.colorScheme === 'dark' ? 'black' : 'black',

                color: theme.colorScheme === 'dark' ? 'white' : 'white',

                '&:hover': {
                  border:
                    theme.colorScheme === 'dark' ? '1px solid black' : '1px solid black',
                  backgroundColor: theme.colorScheme === 'dark' ? 'white' : 'white',
                  color: theme.colorScheme === 'dark' ? 'black' : 'black',
                },
                width: '350px',
                height: '65px',
              })}
            >
              Get started
            </Button>
          </Link>
        </Group>
        </>       
        */}

        {/* YOUR FEEDBACK / DISCORD SECTION */}
        <Space h={100} />
        <div className="bg-white py-16 sm:py-24">
          <div className="sm:px-6 lg:px-60">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
              {/* Inner content wrapper */}
              <div className="mx-auto max-w-7xl">
                <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  If you have ideas, we want to hear them.
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                  We're in the early stages, but our future is ambitious. We are committed
                  to helping developers connect and find meaningful work, with ambitious
                  plans for career-accelerating tools.
                </p>
                <br />
                <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                  Our users are our stakeholders, and we want our goals to align with
                  yours. Join our Discord to share your input and help guide the
                  platform’s development.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link href="https://discord.gg/hkajEH6WkW" passHref legacyBehavior>
                    <Button
                      component="a"
                      target="_blank"
                      variant="gradient"
                      gradient={{ from: '#4970f0', to: '#5865F2', deg: 133 }}
                      radius="lg"
                      size="lg"
                      mt="xl"
                      className={classes.buttonDiscord}
                    >
                      <IconBrandDiscord
                        size={24}
                        strokeWidth={1}
                        color="white"
                        className={classes.iconDiscord}
                      />
                      Join the Discord
                    </Button>
                  </Link>
                </div>
              </div>

              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
                aria-hidden="true"
              >
                <circle
                  cx={512}
                  cy={512}
                  r={512}
                  fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                  fillOpacity="0.7"
                />
                <defs>
                  <radialGradient
                    id="759c1415-0410-454c-8f7c-9a820de03641"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(512 512) rotate(90) scale(512)"
                  >
                    <stop stopColor="#7775D6" />
                    <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
