/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { app, auth } from '@/firebase/clientApp';
import { Dialog, RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, ClockIcon, FlagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getCheckoutUrl } from '@/lib/stripe/stripePaymentProd';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
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

// {
//   name: 'Enterprise',
//   id: 'tier-enterprise',
//   href: '#',
//   price: { monthly: '$48', annually: '$576' },
//   description: 'Dedicated support and infrastructure for your company.',
//   features: [
//     'Unlimited products',
//     'Unlimited subscribers',
//     'Advanced analytics',
//     '1-hour, dedicated support response time',
//     'Marketing automations',
//     'Custom reporting tools',
//   ],
//   mostPopular: false,
// },

const faqs = [
  {
    id: 1,
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
];
const footerNavigation = {
  solutions: [
    { name: 'Marketing', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Commerce', href: '#' },
    { name: 'Insights', href: '#' },
  ],
  support: [
    { name: 'Pricing', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
    { name: 'API Status', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Claim', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Since `frequency.value` is a string and does not guarantee that it will match
// the keys of `price` or `discountedPrice`, we need to assert the type.

// // Utility function to ensure the value is a valid key
// function isValidFrequency(value: string): value is keyof pricingTier['price'] {
//   return value === 'monthly' || value === 'annually';
// }

// // Your component rendering logic
// const frequencyValue = isValidFrequency(frequency.value) ? frequency.value : 'monthly';

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // const upgradeToPremiumMonthly = async () => {
  //   const priceId = 'price_1O80UbCT5BNNo8lF98l4hlov';

  //   const checkoutUrl = await getCheckoutUrl(app, priceId);
  //   Router.push(checkoutUrl);
  // };
  // const upgradeToPremiumAnnual = async () => {
  //   const priceId = 'price_1O7gfECT5BNNo8lFM64LROAo';

  //   const checkoutUrl = await getCheckoutUrl(app, priceId);
  //   Router.push(checkoutUrl);
  // };

  return (
    <div className="bg-gray-900">
      {/* Header */}
      <header>
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt=""
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-white"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm font-semibold leading-6 text-white">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/25">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main>
        {/* Pricing section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              A plan for &nbsp;every&nbsp; dev. <br />
              <br />
              Lock in a launch discount and help shape the future of GitConnect.{' '}
              {/* Pricing plans for teams of&nbsp;all&nbsp;sizes */}
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
            Our aim is make GitConnect the best platform possible for devs. <br />
            To help us achieve that goal pro users will get a chance to influence the
            roadmap and get a say in what features we build next.
            {/* We want every dev to be able to get a great portfolio with GitConnect, your feedback is . */}
            {/* can support us just by using the platform and providing feedback. */}
            {/* Choose an affordable plan that’s packed with the best features for engaging
            your audience, creating customer loyalty, and driving sales. */}
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
                {/* ... other tier details ... */}
                <p className="mt-6 flex items-baseline gap-x-1">
                  {/* Check if the tier is "Pro" and apply discounts */}
                  {tier.name.includes('Pro') ? (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-gray-300 line-through">
                        {/* ${tier.price[frequency.value]}{' '} */}$
                        {tier.price[frequency.value as 'monthly' | 'annually']}{' '}
                        {/* Assuming this is the original price */}
                      </span>
                      <span className="ml-2 text-4xl font-bold tracking-tight text-white">
                        $
                        {tier.discountedPrice &&
                          tier.discountedPrice[
                            frequency.value as 'monthly' | 'annually'
                          ]}{' '}
                        {/* ${tier.discountedPrice[frequency.value]}{' '} */}
                        {/* You will need to add the discounted price in your tier data */}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-300">
                        {frequency.priceSuffix}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-white">
                        {/* {tier.price[frequency.value]} */}
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
                  {/* Conditional rendering for the heading */}
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
      </main>
    </div>
  );
}
