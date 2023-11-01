import React from 'react';
import checkMark from './path/to/check-mark.svg'; // Replace with the actual path to the image
import Image from 'next/image';

// export function PricingSectionTwo() {
//   return (
//     <section>
//       <div className="flex flex-col items-center px-5 py-16 md:px-10 md:py-24 lg:py-32">
//         <div className="mb-8 w-full max-w-3xl text-center md:mb-12 lg:mb-16">
//           <h2 className="text-3xl font-bold md:text-5xl">Simple & Affordable Pricing</h2>
//           <p className="mt-4 text-sm text-[#636262] sm:text-base">Simple & fixed pricing. 30 days money-back guarantee</p>
//         </div>
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//           {/* ... (rest of the code remains the same) */}
          
//           <div className="mt-2 flex flex-row items-center">
//             <img src={checkMark} alt="" className="mr-2 inline-block w-4" />
//             <p className="text-base">Customer Support</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


export function PricingSection() {
  return (
    <section>
      <div className="flex flex-col items-center px-5 py-16 md:px-10 md:py-24 lg:py-32">
        <div className="mb-8 w-full max-w-3xl text-center md:mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold md:text-5xl">Simple & Affordable Pricing</h2>
          <p className="mt-4 text-sm text-[#636262] sm:text-base">Simple & fixed pricing. 30 days money-back guarantee</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Price - Basic */}
          <div className="flex max-w-md flex-col items-start rounded-md border border-[#cdcdcd] p-8">
            <div className="mb-4 rounded-[4px] bg-[#0b0b1f] px-4 py-1.5">
              <p className="text-sm font-bold text-white sm:text-sm">BASIC</p>
            </div>
            <p className="mb-6 text-base font-light text-[#636262] md:mb-10 lg:mb-12">Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam, purus sit</p>
            <h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-5xl lg:mb-8">$99<span className="text-sm font-light sm:text-sm">/year</span></h2>
            <a href="#" className="mb-5 w-full rounded-md bg-black px-6 py-3 text-center font-semibold text-white md:mb-6 lg:mb-8">Get started</a>
            <div className="mt-2 flex flex-row items-center">
              <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
              <p className="text-base">Premium Designs</p>
            </div>
            <div className="mt-2 flex flex-row items-center">
              <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
              <p className="text-base">Exclusive Freebies</p>
            </div>
            <div className="mt-2 flex flex-row items-center">
              <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
              <p className="text-base">Monthly Free Exclusive</p>
            </div>
            <div className="mt-2 flex flex-row items-center">
              <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
              <p className="text-base">Customer Support</p>
            </div>
          </div>
          {/* Price - Pro */}
          <div className="flex max-w-md flex-col items-start rounded-md border border-[#cdcdcd] bg-[#f2f2f7] p-8">
            <div className="mb-4 rounded-[4px] bg-[#0b0b1f] px-4 py-1.5">
              <p className="text-sm font-bold text-white sm:text-sm">PRO</p>
            </div>
            <p className="mb-6 text-base font-light text-[#636262] md:mb-10 lg:mb-12">Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam, purrounded-md</p>
            <h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-5xl lg:mb-8">$149<span className="text-sm font-light sm:text-sm">/year</span></h2>
            <a href="#" className="mb-5 w-full rounded-md bg-black px-6 py-3 text-center font-semibold text-white md:mb-6 lg:mb-8">Get started</a>
            <div className="mt-2 flex flex-row items-center">
              <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
              <p className="text-base">Premium Designs</p>
            </div>
            <div className="mt-2 flex flex-row items-center">
              <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
              <p className="text-base">Exclusive Freebies</p>
            </div>
            <div className="mt-2 flex flex-row items-center">
              <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
              <p className="text-base">Monthly Free Exclusive</p>
            </div>
            <div className="mt-2 flex flex-row items-center">
              <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
              <p className="text-base">Customer Support</p>
            </div>
          </div>
          {/* ... (rest of the code for the second price card, which is already translated) */}
        </div>
      </div>
    </section>
  );
}


// export default function PricingSection() {
//   return (
//     <section>
//       <div className="flex flex-col items-center px-5 py-16 md:px-10 md:py-24 lg:py-32">
//         <div className="mb-8 w-full max-w-3xl text-center md:mb-12 lg:mb-16">
//           <h2 className="text-3xl font-bold md:text-5xl">Simple & Affordable Pricing</h2>
//           <p className="mt-4 text-sm text-[#636262] sm:text-base">Simple & fixed pricing. 30 days money-back guarantee</p>
//         </div>
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//           <div className="flex max-w-md flex-col items-start rounded-md border border-[#cdcdcd] p-8">
//             {/* ... (rest of the code for the first price card) */}
//           </div>
          // <div className="flex max-w-md flex-col items-start rounded-md border border-[#cdcdcd] bg-[#f2f2f7] p-8">
          //   <div className="mb-4 rounded-[4px] bg-[#0b0b1f] px-4 py-1.5">
          //     <p className="text-sm font-bold text-white sm:text-sm">GROWTH</p>
          //   </div>
          //   <p className="mb-6 text-base font-light text-[#636262] md:mb-10 lg:mb-12">Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam, purrounded-md</p>
          //   <h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-5xl lg:mb-8">$149<span className="text-sm font-light sm:text-sm">/year</span></h2>
          //   <a href="#" className="mb-5 w-full rounded-md bg-black px-6 py-3 text-center font-semibold text-white md:mb-6 lg:mb-8">Get started</a>
          //   <div className="mt-2 flex flex-row items-center">
          //     <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
          //     <p className="text-base">Premium Designs</p>
          //   </div>
          //   <div className="mt-2 flex flex-row items-center">
          //     <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
          //     <p className="text-base">Exclusive Freebies</p>
          //   </div>
          //   <div className="mt-2 flex flex-row items-center">
          //     <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" className="mr-2 inline-block w-4" />
          //     <p className="text-base">Monthly Free Exclusive</p>
          //   </div>
          // </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default function PricingSection() {

//   return (
//   <section>
//     {/* <!-- Container --> */}
//     <div class="flex flex-col items-center px-5 py-16 md:px-10 md:py-24 lg:py-32">
//       {/* <!-- Heading Container --> */}
//       <div class="mb-8 w-full max-w-3xl text-center md:mb-12 lg:mb-16">
//         {/* <!-- Heading --> */}
//         <h2 class="text-3xl font-bold md:text-5xl">Simple & Affordable Pricing</h2>
//         {/* <!-- Subheading --> */}
//         <p class="mt-4 text-sm text-[#636262] sm:text-base">Simple & fixed pricing. 30 days money-back guarantee</p>
//       </div>
//       {/* <!-- Price Container --> */}
//       <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
//         {/* <!-- Price  --> */}
//         <div class="flex max-w-md flex-col items-start rounded-md border border-[#cdcdcd] p-8">
//           <div class="mb-4 rounded-[4px] bg-[#0b0b1f] px-4 py-1.5">
//             <p class="text-sm font-bold text-white sm:text-sm">BASIC</p>
//           </div>
//           <p class="mb-6 text-base font-light text-[#636262] md:mb-10 lg:mb-12">Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam, purus sit</p>
//           <h2 class="mb-5 text-3xl font-bold md:mb-6 md:text-5xl lg:mb-8">$99<span class="text-sm font-light sm:text-sm">/year</span>
//           </h2>
//           <a href="#" class="mb-5 w-full rounded-md bg-black px-6 py-3 text-center font-semibold text-white md:mb-6 lg:mb-8">Get started</a>
//           <div class="mt-2 flex flex-row items-center">
//             <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" class="mr-2 inline-block w-4" />
//             <p class="text-base">Premium Designs</p>
//           </div>
//           <div class="mt-2 flex flex-row items-center">
//             <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" class="mr-2 inline-block w-4" />
//             <p class="text-base">Exclusive Freebies</p>
//           </div>
//           <div class="mt-2 flex flex-row items-center">
//             <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" class="mr-2 inline-block w-4" />
//             <p class="text-base">Monthly Free Exclusive</p>
//           </div>
//           <div class="mt-2 flex flex-row items-center">
//             <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" class="mr-2 inline-block w-4" />
//             <p class="text-base">Customer Support</p>
//           </div>
//         </div>
//         {/* <!-- Price  --> */}
//         <div class="flex max-w-md flex-col items-start rounded-md border border-[#cdcdcd] bg-[#f2f2f7] p-8">
//           <div class="mb-4 rounded-[4px] bg-[#0b0b1f] px-4 py-1.5">
//             <p class="text-sm font-bold text-white sm:text-sm">GROWTH</p>
//           </div>
//           <p class="mb-6 text-base font-light text-[#636262] md:mb-10 lg:mb-12">Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam, purrounded-md</p>
//           <h2 class="mb-5 text-3xl font-bold md:mb-6 md:text-5xl lg:mb-8">$149<span class="text-sm font-light sm:text-sm">/year</span>
//           </h2>
//           <a href="#" class="mb-5 w-full rounded-md bg-black px-6 py-3 text-center font-semibold text-white md:mb-6 lg:mb-8">Get started</a>
//           <div class="mt-2 flex flex-row items-center">
//             <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" class="mr-2 inline-block w-4" />
//             <p class="text-base">Premium Designs</p>
//           </div>
//           <div class="mt-2 flex flex-row items-center">
//             <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" class="mr-2 inline-block w-4" />
//             <p class="text-base">Exclusive Freebies</p>
//           </div>
//           <div class="mt-2 flex flex-row items-center">
//             <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" class="mr-2 inline-block w-4" />
//             <p class="text-base">Monthly Free Exclusive</p>
//           </div>
//           <div class="mt-2 flex flex-row items-center">
//             <img src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg" alt="" class="mr-2 inline-block w-4" />
//             <p class="text-base">Customer Support</p>
//           </div>
//         </div>
//       </div>
//     </div>
//     </section>
//   )

// }