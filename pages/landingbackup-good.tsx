import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, Disclosure } from '@headlessui/react';
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
import { auth } from '@/firebase/clientApp';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import mixpanel from 'mixpanel-browser';
// import Router from 'next/router';
import { useRouter } from "next/router"

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

const tiers = [
  {
    name: 'Free',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$0',
    description: 'Get started with GitConnect.',
    features: [
      '3 projects',
      'Github Integration',
      'Access the Discord',
      // 'Advanced analytics',
      // '24-hour support response time'
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$15 AUD',
    description: 'Build the ultimate portfolio. Help forge the path ahead.',
    features: [
      'Unlimited projects',
      'Get featured more often',
      'Influence the roadmap',
      // 'Access the pro Discord',
      'Custom URLs - coming soon',
      'AI integration - coming soon',
      // 'Custom integrations',
    ],
    featured: true,
  },
];
const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// <div className={classes.hero}>
// <Box
//   sx={() => ({
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     // backgroundSize: 'cover',
//     transition: 'transform 500ms ease',
//   })}
// >
//   {/* <Box ml={400}> */}
//   <Image

//     // src={image ? image : '/img/gitconnect.jpg'}
//     src="/img/gitconnect.webp"
//     className="image"
//     style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
//     sizes="100vw"
//     fill={true}
//     quality={100}
//     alt=""
//     priority={true}
//     // priority = {imageUrl.includes('.gif') ? true : false}
//   />
//   </Box>
// {/* </Box> */}
// <Overlay
//   gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgb(0 0 0 / 89%) 40%)"
//   // gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
//   opacity={1}
//   zIndex={0}
//       />
//       </div>

export default function LandingPage() {


  const Router = useRouter()

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
    <div className="bg-white">
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
                {/* <Flex
              mt={40}
              // direction={{ xl: 'row', md:'row', xs: 'column' }}
                direction={{ base:'column', md: 'column',sm:'row', xs:'row'}}
              // justify='center'
              justify={{ md: 'flex-start', sm:'center' }}
              align='center'
              // className={classes.heroMobileLayout}
              // position='center'
              // {(theme) => ({ [theme.fn.smallerThan('sm')]: 'center' })}
              // 'center'
            > */}
                {/* <Group> */}
                {/* <div className="mt-10 flex items-center justify-center gap-x-6" */}
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
                {/* </Group> */}
                {/* </Flex> */}
                {/* <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  >
                    Get started
                  </a>
                  <a href="#" className="text-sm font-semibold leading-6 text-white">
                    Live demo <span aria-hidden="true">→</span>
                  </a>
                </div> */}
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
        {/* <Space */}
        {/* 
        <div className="relative bg-gray-900 pt-20 pb-20">
  <div className="mx-auto flex flex-wrap max-w-7xl flex-col items-center gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch justify-center">
    <div className="w-full max-w-md xl:w-1/3 xl:flex-none mt-8">
      <div className="relative aspect-w-16 aspect-h-9 h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
        <img
          className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
          src="https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe"
          alt="Danny's Image"
        />
      </div>
    </div>

    <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
      <h1 className="text-4xl font-bold text-white">
        Hi, I'm Danny - founder of GitConnect
      </h1>
      <p className="mt-4 text-lg text-white">
        Ever had a family member or significant other ask what you actually do for work, and haven't been able to provide a satisfying answer? Now you can show them GitConnect.
      </p>
      <button className="mt-6 px-8 py-2 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors">
        Danny's Portfolio
      </button>
    </div>
  </div>
</div> */}
        <div className="relative bg-gray-900 pt-48 pb-60">
    <div className="mx-auto flex max-w-7xl flex-col-reverse md:flex-col-reverse lg:flex-row items-center gap-y-10 px-6 md:gap-y-8 lg:px-8 xl:items-stretch">
        {/* Danny's Introduction and CTA */}
        <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto lg:px-16 md:px-6 xl:px-16 xl:py-24">
            <h1 className="text-4xl font-bold text-white">
                Hi, I'm Danny - founder of GitConnect
            </h1>
              <p className=" italic mt-4 text-lg text-white">
              Devs are capable of incredible things, and our goal is to give you a place to share whatever your ‘incredible thing’ might be. Whether you are a budding developer looking to create a professional presence online or a seasoned software engineer wanting to showcase your magnum opus - GitConnect is for you.
                {/* Ever had a family member or significant other ask what you actually do for work, and haven't been able to provide a satisfying answer? Now you can show them GitConnect. */}
              </p>
              <Link href="/portfolio/dannydoesdev" passHref legacyBehavior>
                <Button
                  className='bg-white rounded-full text-gray-90 transition-colors'
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

{/* 
        <div className="relative bg-gray-900 pt-20 pb-20">
          <div className="mx-auto flex flex-wrap max-w-7xl flex-col items-center gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch justify-center">
            <div className="w-full max-w-md xl:w-1/3 xl:flex-none mt-8 h-96 md:h-128 xl:h-auto">
              <div className="relative h-full md:-mx-8 xl:mx-0">
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                  src="https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe"
                  alt="Danny's Image"
                />
              </div>
            </div>
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <h1 className="text-4xl font-bold text-white">
                Hi, I'm Danny - founder of GitConnect
              </h1>
              <p className="mt-4 text-lg text-white">
                Ever had a family member or significant other ask what you actually do for
                work, and haven't been able to provide a satisfying answer? Now you can
                show them GitConnect.
              </p>
              <button className="mt-6 px-8 py-2 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors">
                Danny's Portfolio
              </button>
            </div>
          </div>
        </div>

        <div className="relative bg-gray-900 pt-20 pb-20">
          <div className="mx-auto flex max-w-7xl flex-col-reverse sm:flex-col lg:flex-row items-center gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:items-stretch">
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <h1 className="text-4xl font-bold text-white">
                Hi, I'm Danny - founder of GitConnect
              </h1>
              <p className="mt-4 text-lg text-white">
                Ever had a family member or significant other ask what you actually do for
                work, and haven't been able to provide a satisfying answer? Now you can
                show them GitConnect.
              </p>
              <button className="mt-6 px-8 py-2 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors">
                Danny's Portfolio
              </button>
            </div>

            <div className="w-full max-w-xs sm:max-w-md xl:w-1/3 xl:flex-none mt-8">
              <div className="relative aspect-w-16 aspect-h-9 h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                  src="https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe"
                  alt="Danny's Image"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="relative bg-gray-900 pt-20 pb-20">
  <div className="mx-auto flex flex-wrap max-w-7xl flex-col items-cente lg:flex-row gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch justify-center">
    <div className="w-full max-w-md xl:w-1/3 xl:flex-none mt-8 h-96 md:h-128 lg:h-auto xl:h-auto">
      <div className="relative h-full md:-mx-8 xl:mx-0">
        <img
          className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
          src="https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe"
          alt="Danny's Image"
        />
      </div>
    </div>

    <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
      <h1 className="text-4xl font-bold text-white">
        Hi, I'm Danny - founder of GitConnect
      </h1>
      <p className="mt-4 text-lg text-white">
        Ever had a family member or significant other ask what you actually do for work, and haven't been able to provide a satisfying answer? Now you can show them GitConnect.
      </p>
      <button className="mt-6 px-8 py-2 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors">
        Danny's Portfolio
      </button>
    </div>
  </div>
</div> */}

        {/* Introduction and Image */}
        {/* <div className="relative bg-gray-900 pt-20 pb-20">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
            <div className="w-full max-w-md xl:w-1/3 xl:flex-none mt-8">
              {' '}
              <div className="relative aspect-w-16 aspect-h-9 h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                  src="https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe"
                  alt="Danny's Image"
                />
              </div>
            </div>

            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <h1 className="text-4xl font-bold text-white">
                Hi, I'm Danny - founder of GitConnect
              </h1>
              <p className="mt-4 text-lg text-white">
                Ever had a family member or significant other ask what you actually do for
                work, and haven't been able to provide a satisfying answer? Now you can
                show them GitConnect.
              </p>
              <button className="mt-6 px-8 py-2 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors">
                Danny's Portfolio
              </button>
            </div>
          </div>
        </div> */}

        {/* Remaining sections remain unchanged */}

        {/* Introduction and Image */}
        {/* <div className="relative bg-gray-900 pb-20 pt-20">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch"> */}
        {/* Danny's Image */}
        {/* <div className="-mt-8 w-full max-w-2xl xl:w-1/2 xl:flex-none">
            <div className="relative aspect-w-16 aspect-h-9 h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
                <img
                    className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                    src='https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe'
                    alt="Danny's Image"
                />
            </div>
        </div> */}

        {/* Danny's Introduction and CTA */}
        {/* <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
            <h1 className="text-4xl font-bold text-white">Hi, I'm Danny - founder of GitConnect</h1>
            <p className="mt-4 text-lg text-white">Ever had a family member or significant other ask what you actually do for work, and haven't been able to provide a satisfying answer? Now you can show them GitConnect.</p>
            <button className="mt-6 px-8 py-2 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors">
                Danny's Portfolio
            </button>
        </div>
    </div>
</div> */}

        {/* Builders Welcome Section */}
        {/* <div className="mt-16 px-6">
    <h2 className="text-2xl font-bold text-gray-900">All builders are welcome.</h2>
    <p className="mt-4 text-lg text-gray-700">Devs are capable of incredible things and we want to give you a place to share whatever your ‘incredible thing’ might be. Whether you are a budding developer looking to create a professional presence online or a seasoned software engineer wanting to showcase your magnum opus -GitConnect is for you.</p>
</div> */}

        {/* Testimonial section */}
        {/* <div className="relative z-10 mt-32 bg-gray-900 pb-20 sm:mt-56 sm:pb-24 xl:pb-0">
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-[calc(50%-19rem)] top-[calc(50%-36rem)] transform-gpu blur-3xl">
              <div
                className="aspect-[1097/1023] w-[68.5625rem] bg-gradient-to-r from-[#ff4694] to-[#776fff] opacity-25"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
            <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
              <div className="relative aspect-[2/1] h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                  // src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
                  src='https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/landing%2Fdanny-avatar_768x768.webp?alt=media&token=000c312d-1152-4120-9975-41bf0860c0fe'
                  alt=""
                />
              </div>
            </div>
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <figure className="relative isolate pt-6 sm:pt-12">
                <svg
                  viewBox="0 0 162 128"
                  fill="none"
                  aria-hidden="true"
                  className="absolute left-0 top-0 -z-10 h-32 stroke-white/20"
                >
                  <path
                    id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                    d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                  />
                  <use href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" x={86} />
                </svg>
                <blockquote className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                  <p>
                    Gravida quam mi erat tortor neque molestie. Auctor aliquet at porttitor a enim nunc suscipit
                    tincidunt nunc. Et non lorem tortor posuere. Nunc eu scelerisque interdum eget tellus non nibh
                    scelerisque bibendum.
                  </p>
                </blockquote>
                <figcaption className="mt-8 text-base">
                  <div className="font-semibold text-white">Judith Black</div>
                  <div className="mt-1 text-gray-400">CEO of Tuple</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div> */}

        {/* Pricing section */}
        <div className="relative isolate mt-32 bg-white px-6 sm:mt-56 lg:px-8">
          <div
            className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
            aria-hidden="true"
          >
            <div
              className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Start for free. Unlock advanced features as you grow.{' '}
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
            We want every dev to be able to get a great portfolio with GitConnect, and you
            can support us just by using the platform and providing feedback.
            {/* We have heaps of features we want to add, if you in the pipeline - you can lock in a discount  If you want to support our vision and help GitConnect grow - grab 40% off for limited time the promo EARLYBIRD. */}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
            {/* We want every dev to be able to get a great portfolio with GitConnect, and you can support us just by using the platform and providing feedback. */}
            We are planning to release heaps more features, especially for our pro users.
            If you want to contribute to this vision, and help forge the path ahead, you can lock in a discounted rate
            with 40% off for limited time - use code EARLYADOPTER.
          </p>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
            {tiers.map((tier, tierIdx) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.featured
                    ? 'relative bg-gray-900 shadow-2xl'
                    : 'bg-white/60 sm:mx-8 lg:mx-0',
                  tier.featured
                    ? ''
                    : tierIdx === 0
                    ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                    : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
                  'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
                )}
              >
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                    'text-base font-semibold leading-7'
                  )}
                >
                  {tier.name}
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span
                    className={classNames(
                      tier.featured ? 'text-white' : 'text-gray-900',
                      'text-5xl font-bold tracking-tight'
                    )}
                  >
                    {tier.priceMonthly}
                  </span>
                  <span
                    className={classNames(
                      tier.featured ? 'text-gray-400' : 'text-gray-500',
                      'text-base'
                    )}
                  >
                    /month
                  </span>
                </p>
                <p
                  className={classNames(
                    tier.featured ? 'text-gray-300' : 'text-gray-600',
                    'mt-6 text-base leading-7'
                  )}
                >
                  {tier.description}
                </p>
                <ul
                  role="list"
                  className={classNames(
                    tier.featured ? 'text-gray-300' : 'text-gray-600',
                    'mt-8 space-y-3 text-sm leading-6 sm:mt-10'
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className={classNames(
                          tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                          'h-6 w-5 flex-none'
                        )}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* <a
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={classNames(
                    tier.featured
                      ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                      : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
                    'mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
                  )}
                >
                  Get started today
                </a> */}
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

                  // color: 'white',

                  // border: '1px solid white',
                },
                width: '350px',
                height: '65px',
                // minWidth: '25%',
                // maxWidth: '35%',
                // )
                // :(
                // border: '1px solid black',
                // '&:hover': {
                //   color: 'white',
                //   backgroundColor: 'black',
                //   border: '1px solid white',
                // },
                // )
              })}
              // fullWidth={true}
              //  sx={(theme) => ({
              //   // subscribe to color scheme changes
              //   backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
              // })}
            >
              Get started
            </Button>
          </Link>
        </Group>

        {/* <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Boost your productivity today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur
            commodo do ea.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
        </div> */}
        <Space h={100} />

        {/* <div className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
              <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                If you have ideas, we want to hear them.
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                We're in the early stages, but our future is ambitious. We're committed to
                helping developers connect and find meaningful work, with ambitious plans
                for career-accelerating tools.
              </p>

              <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                Join our Discord to share your input and help guide the platform’s
                development.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="https://discord.gg/hkajEH6WkW" passHref legacyBehavior>
                  <Button
                    component="a"
                    target="_blank"
                    variant="gradient"
                    gradient={{ from: '#4970f0', to: '#5865F2', deg: 133 }}
                    // color='indigo'
                    radius="lg"
                    size="lg"
                    mt="xl"
                    className={classes.buttonDiscord}
                  >
                    <IconBrandDiscord
                      size={24}
                      strokeWidth={1}
                      color="white"
                      // paddingRight='sm'
                      className={classes.iconDiscord}
                    />
                    Join the Discord
                  </Button>
                </Link>
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
        </div> */}
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
                Our users are our stakeholders, and we want our goals to align with yours. Join our Discord to share your input and help guide the platform’s development. 
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

        {/* 
        <div className="bg-white py-16 sm:py-24">
          <div className="mx-auto w-7/10 sm:px-6 lg:px-60">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl xl:py-32">


              <div className="mx-auto max-w-7xl">
                
                <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    If you have ideas, we want to hear them.
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                    We're in the early stages, but our future is ambitious. We're committed to
                    helping developers connect and find meaningful work, with ambitious plans
                    for career-accelerating tools.
                </p>
                <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                    Join our Discord to share your input and help guide the platform’s
                    development.
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
</div> */}
      </main>
    </div>
  );
}

{
  /* Our goal is to help developers find a community and meaningful work. We plan to release more tools to inspire, connect, and accelerate the careers of software engineers. */
}
{
  /* Join the Discord and tell us what you think, what should we be focussed on, or what needs to be improved - our users are our stakeholders and we want to align our goals to yours. */
}
{
  /* <div className='className="mx-auto mt-10 flex max-w-md gap-x-4'> */
}

{
  /* Feedback and Engagement */
}
{
  /* <div className="mt-16 px-6">
    <h2 className="text-2xl font-bold text-gray-900">If you have ideas, we want to hear them.</h2>
    <p className="mt-4 text-lg text-gray-700">We're in the early stages, but our future is ambitious. Our goal is to help developers find a community and meaningful work. We plan to release more tools to inspire, connect, and accelerate the careers of software engineers.</p>
    <p className="mt-2 text-lg text-gray-700">Join the Discord and tell us what you think, what should we be focussed on, or what needs to be improved - our users are our stakeholders and we want to align our goals to yours.</p>
</div> */
}

{
  /* <form className="mx-auto mt-10 flex max-w-md gap-x-4">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Notify me
            </button>
          </form>*/
}

{
  /* Footer */
}
{
  /* <footer className="mt-32 bg-gray-900 sm:mt-56" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <img
              className="h-7"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Company name"
            />
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.solutions.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.support.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer> */
}

{
  /* FAQ section */
}
{
  /* <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="text-base font-semibold leading-7">{faq.question}</span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                              <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div> */
}
