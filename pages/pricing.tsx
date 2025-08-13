import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { app } from '@/firebase/clientApp';
import { Dialog, RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getCheckoutUrl } from '@/features/payments/lib/stripePaymentProd';

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

type pricingTier = {
  name: string;
  id: string;
  href: string;
  button: string;
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

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [frequency, setFrequency] = useState(pricing.frequencies[0]);
  const { userData, currentUser } = useContext(AuthContext);

  const Router = useRouter();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const newPremiumStatus = userData ? userData.isPro : false;
    setIsPro(newPremiumStatus);
  }, [userData]);

  const upgradeToPremiumMonthly = async () => {
    if (process.env.NEXT_PUBLIC_ENABLE_PAYMENTS !== 'true') return;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY as string;
    if (!priceId) return;
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    Router.push(checkoutUrl);
  };
  const upgradeToPremiumAnnual = async () => {
    if (process.env.NEXT_PUBLIC_ENABLE_PAYMENTS !== 'true') return;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL as string;
    if (!priceId) return;
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    Router.push(checkoutUrl);
  };

  return (
    <div className='bg-gray-900'>
      <header>
        <nav
          className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'
          aria-label='Global'
        >
          <div className='flex lg:flex-1'>
            <a href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your Company</span>
              <img
                className='h-8 w-auto'
                src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                alt=''
              />
            </a>
          </div>
          <div className='flex lg:hidden'>
            <button
              type='button'
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400'
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='hidden lg:flex lg:gap-x-12'>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className='text-sm font-semibold leading-6 text-white'
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
            <a href='#' className='text-sm font-semibold leading-6 text-white'>
              Log in <span aria-hidden='true'>&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog
          as='div'
          className='lg:hidden'
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className='fixed inset-0 z-50' />
          <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10'>
            <div className='flex items-center justify-between'>
              <a href='#' className='-m-1.5 p-1.5'>
                <span className='sr-only'>Your Company</span>
                <img
                  className='h-8 w-auto'
                  src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                  alt=''
                />
              </a>
              <button
                type='button'
                className='-m-2.5 rounded-md p-2.5 text-gray-400'
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className='sr-only'>Close menu</span>
                <XMarkIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='mt-6 flow-root'>
              <div className='-my-6 divide-y divide-gray-500/25'>
                <div className='space-y-2 py-6'>
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800'
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className='py-6'>
                  <a
                    href='#'
                    className='-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800'
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
        <div className='mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8'>
          <div className='mx-auto max-w-4xl text-center'>
            <h1 className='text-base font-semibold leading-7 text-indigo-400'>
              Pricing
            </h1>
            <p className='mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl'>
              A plan for &nbsp;every&nbsp; dev. <br />
              <br />
              Lock in a launch discount and help shape the future of GitConnect.{' '}
              {/* Pricing plans for teams of&nbsp;all&nbsp;sizes */}
            </p>
          </div>
          <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300'>
            Our aim is make GitConnect the best platform possible for devs.{' '}
            <br />
            To help us achieve that goal pro users will get a chance to
            influence the roadmap and get a say in what features we build next.
            {/* We want every dev to be able to get a great portfolio with GitConnect, your feedback is . */}
            {/* can support us just by using the platform and providing feedback. */}
            {/* Choose an affordable plan that’s packed with the best features for engaging
            your audience, creating customer loyalty, and driving sales. */}
          </p>
          <div className='mt-16 flex justify-center'>
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className='grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white'
            >
              <RadioGroup.Label className='sr-only'>
                Payment frequency
              </RadioGroup.Label>
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

          <div className='isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
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
                <div className='flex items-center justify-between gap-x-4'>
                  <h2
                    id={tier.id}
                    className='text-lg font-semibold leading-8 text-white'
                  >
                    {tier.name}
                  </h2>
                  {tier.mostPopular ? (
                    <p className='rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white'>
                      Launch Deal
                    </p>
                  ) : null}
                </div>
                <p className='mt-4 text-sm leading-6 text-gray-300'>
                  {tier.description}
                </p>
                <p className='mt-6 flex items-baseline gap-x-1'>
                  {tier.name.includes('Pro') ? (
                    <>
                      <span className='text-4xl font-bold tracking-tight text-gray-300 line-through'>
                        ${tier.price[frequency.value as 'monthly' | 'annually']}{' '}
                      </span>
                      <span className='ml-2 text-4xl font-bold tracking-tight text-white'>
                        $
                        {tier.discountedPrice &&
                          tier.discountedPrice[
                            frequency.value as 'monthly' | 'annually'
                          ]}{' '}
                      </span>
                      <span className='text-sm font-semibold leading-6 text-gray-300'>
                        {frequency.priceSuffix}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-4xl font-bold tracking-tight text-white'>
                        {tier.price[frequency.value as 'monthly' | 'annually']}{' '}
                      </span>
                      <span className='text-sm font-semibold leading-6 text-gray-300'>
                        {frequency.priceSuffix}
                      </span>
                    </>
                  )}
                </p>
                {tier.name.includes('Pro') ? (
                  currentUser ? (
                    frequency?.value === 'annually' ? (
                      <a
                        onClick={() => upgradeToPremiumAnnual()}
                        aria-describedby={tier.id}
                        className={classNames(
                          tier.mostPopular
                            ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                            : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                          'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                        )}
                      >
                        {tier.button}
                      </a>
                    ) : (
                      frequency?.value === 'monthly' && (
                        <a
                          onClick={() => upgradeToPremiumMonthly()}
                          aria-describedby={tier.id}
                          className={classNames(
                            tier.mostPopular
                              ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                              : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                            'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                          )}
                        >
                          {tier.button}
                        </a>
                      )
                    )
                  ) : (
                    <a
                      href='/login'
                      aria-describedby={tier.id}
                      className={classNames(
                        tier.mostPopular
                          ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                          : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                        'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                      )}
                    >
                      Login or Signup to buy
                    </a>
                  )
                ) : (
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className={classNames(
                      tier.mostPopular
                        ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                        : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                      'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                    )}
                  >
                    {tier.button}
                  </a>
                )}
                <div className='text-center gap-2 mt-8 text-sm text-gray-400'>
                  <ClockIcon
                    className='inline-block h-4 w-4 mr-1 text-blue-300 align-text-bottom'
                    aria-hidden='true'
                  />
                  = Feature planned / coming soon
                </div>
                <ul
                  role='list'
                  className='mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10'
                >
                  {/* Conditional rendering for the heading */}
                  {tier.name.includes('Basic') && (
                    <p className='text-md font-bold uppercase my-4'>
                      Includes:
                    </p>
                  )}
                  {tier.name.includes('Pro') && (
                    <p className='text-md font-bold uppercase my-4'>
                      Everything in Basic, plus:
                    </p>
                  )}
                  {tier.name.includes('Freelancer') && (
                    <p className='text-md font-bold uppercase my-4'>
                      Everything in Pro, plus:
                    </p>
                  )}
                  {tier.features.map((feature) => (
                    <li
                      key={feature.description}
                      className='flex gap-x-3 items-center'
                    >
                      {!feature.comingSoon ? (
                        <CheckIcon
                          className='h-6 w-5 flex-none text-white'
                          aria-hidden='true'
                        />
                      ) : (
                        <ClockIcon
                          className='h-4 w-5 flex-none text-blue-300'
                          aria-hidden='true'
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
