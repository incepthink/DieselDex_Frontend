"use client";

import React from "react";
import Image from "next/image";
import { PiInfoDuotone } from "react-icons/pi";
import { PiTrophyDuotone } from "react-icons/pi";
import Container from "@/components/common/Container";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import Positions from "@/components/pages/liquidity-page/Positions/Positions";
import Pools from "@/components/pages/liquidity-page/pools/Pools";
import AuthLayout from "./Layout";

const Liquidity = () => {
  return (
    <LayoutWrapper>
      <AuthLayout>
        <div className="fixed top-0 bg-gradient-to-r from-[#FAF7F0] to-[#F7D4C3] w-full h-screen">
          <div className="absolute bottom-0 w-full z-0">
            <Image
              src={"/images/bg-image.png"}
              alt="hero"
              width={1000}
              height={500}
              quality={100}
              className="object-contain w-full"
            />
          </div>
          <Container>
            <div className="flex flex-col justify-start items-start gap-10 rounded-xl p-4 lg:p-8 bg-white z-30 mt-16 lg:mt-20 h-[80%] lg:h-[82%] w-full overflow-y-scroll">
              {/* <section className='flex flex-col justify-center items-center gap-2 bg-[#FAF8F1] px-4 py-4 lg:py-6 w-full'>
              <div className='flex justify-center items-center'>
                <div className='p-2 rounded-full bg-[#E16B31] text-xl text-white cursor-pointer'>
                  <PiFilesDuotone />
                </div>
              </div>
              <p className='lg:text-lg font-semibold'>
                Your liquidity will appear here
              </p>
            </section> */}

              <Positions />

              <section className="w-full">
                <Pools />
              </section>

              {/* <section className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 w-full mb-12 lg:mb-0'>
              <div className='flex justify-start items-center gap-2 bg-[#FAF8F1] px-4 lg:px-6 py-4 w-full'>
                <div className='flex justify-center items-center'>
                  <div className='p-2 lg:p-3 rounded-md bg-[#E16B31] text-2xl lg:text-3xl text-white cursor-pointer'>
                    <PiInfoDuotone />
                  </div>
                </div>
                <div className='font-semibold'>
                  <p className='lg:text-lg'>Your liquidity will appear here</p>
                  <p className='text-sm lg:text-base text-black text-opacity-65'>
                    Click here to see the guide
                  </p>
                </div>
              </div>
              <div className='flex justify-start items-center gap-2 bg-[#FAF8F1] px-4 lg:px-6 py-4 w-full'>
                <div className='flex justify-center items-center'>
                  <div className='p-2 lg:p-3 rounded-md bg-[#E16B31] text-2xl lg:text-3xl text-white cursor-pointer'>
                    <PiTrophyDuotone />
                  </div>
                </div>
                <div className='font-semibold'>
                  <p className='lg:text-lg'>Fuel Points Program</p>
                  <p className='text-sm lg:text-base text-black text-opacity-65'>
                    Join the Fuel Points program. Learn more
                  </p>
                </div>
              </div>
            </section> */}
            </div>
          </Container>
        </div>
      </AuthLayout>
    </LayoutWrapper>
  );
};

export default Liquidity;

// const PoolTable = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const router = useRouter();

//   const handleClick = () => {
//     router.push("/liquidity/create-pool");
//   };

//   const { data, isLoading } = usePoolsData();
//   console.log(data);

//   const filteredPools = data?.filter((pool) => {
//     const searchTerm = searchQuery.toLowerCase();
//     return (
//       pool.details.asset_0_symbol?.toLowerCase().includes(searchTerm) ||
//       pool.details.asset_0_symbol?.toLowerCase().includes(searchTerm)
//     );
//   });

//   return (
//     <div>
//       <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 mb-6'>
//         <h1 className='text-xl lg:text-2xl font-bold'>All Pools</h1>
//         <div className='relative'>
//           <IoSearchOutline className='absolute left-2 top-1/2 -translate-y-1/2 text-xl' />
//           <input
//             type='text'
//             placeholder='Search pools...'
//             className='pl-9 pr-4 py-2.5 bg-[#FAF8F1] w-[300px] rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent'
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className='rounded-xl border border-black border-opacity-20 shadow-sm overflow-auto lg:overflow-hidden'>
//         <table className='w-full'>
//           <thead className='font-semibold text-[#84919A] bg-[#F6F8F9] '>
//             <tr className='border-0 text-start text-sm lg:text-base'>
//               <th className='px-4 py-4 text-left'>POOLS</th>
//               <th className='px-4 py-4'>APR</th>
//               <th className='px-4 py-4'>24H VOLUME</th>
//               <th className='px-4 py-4'>TVL</th>
//               <th className='px-4 py-4'>
//                 <button
//                   onClick={() => handleClick()}
//                   className='px-4 lg:px-6 py-2 lg:py-2.5 rounded-md font-medium text-sm lg:text-lg text-white bg-[#E16B31]'
//                 >
//                   Create Pool
//                 </button>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {!isLoading ? (
//               filteredPools.length > 0 ? (
//                 filteredPools?.map((pool, i) => (
//                   <DesktopPoolRow key={i} poolData={pool} />
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className='text-lg font-medium text-center py-6 text-black text-opacity-60'
//                   >
//                     No pools available
//                   </td>
//                 </tr>
//               )
//             ) : (
//               <div className='flex justify-center flex-col items-center w-full'>
//                 <LoaderV2 />
//                 <p>Loading Table...</p>
//               </div>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
