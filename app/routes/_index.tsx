import Button from "~/components/button";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import Container from "~/components/common/container";
import { authenticate } from "~/utils/auth.server";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import HowToPlay from "~/components/common/how-to-play";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  return json({ user });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <Container user={user}>
      <div className="w-screen h-screen">
        <div className="w-full h-[115px] sm:h-[150px] md:h-[200px] lg:h-[350px] overflow-hidden relative">
          <img
            className="w-full absolute z-[-1]"
            src="/images/flash.gif"
            alt=""
          />
          <div className="bottom-0 h-full w-full flex flex-nowrap justify-center items-end">
            <motion.img
              animate={{
                x: 0,
                opacity: 1,
              }}
              initial={{
                x: -100,
                opacity: 0,
              }}
              transition={{ delay: 0.2 }}
              className="w-1/5 absolute z-[2] left-[5%]"
              src="/images/babar.png"
              alt=""
            />
            <motion.img
              animate={{
                x: 0,
                opacity: 1,
              }}
              initial={{
                x: -100,
                opacity: 0,
              }}
              transition={{ delay: 0.1 }}
              className="w-1/5 absolute z-[2] left-[12%]"
              src="/images/quinton.png"
              alt=""
            />
            <motion.img
              animate={{
                x: 0,
                opacity: 1,
              }}
              initial={{
                x: -100,
                opacity: 0,
              }}
              className="w-1/5 absolute z-[2] left-[20%]"
              src="/images/bolt.png"
              alt=""
            />
            <div className="bg-purple-1 w-[27%] h-full flex justify-center items-center clip-path-polygon-[0%_0%,100%_0%,85%_65%,100%_100%,0%_100%,15%_65%]">
              <img
                className="w-[45%]"
                src="/images/cb-logo-large.webp"
                alt=""
              />
            </div>
            <motion.img
              animate={{
                x: 0,
                opacity: 1,
              }}
              initial={{
                x: 100,
                opacity: 0,
              }}
              className="w-1/5 absolute z-[2] right-[20%]"
              src="/images/virat_kohli.png"
              alt=""
            />
            <motion.img
              animate={{
                x: 0,
                opacity: 1,
              }}
              initial={{
                x: 100,
                opacity: 0,
              }}
              transition={{ delay: 0.1 }}
              className="w-1/5 absolute z-[2] right-[12%]"
              src="/images/mitchell-starc.png"
              alt=""
            />
            <motion.img
              animate={{
                x: 0,
                opacity: 1,
              }}
              initial={{
                x: 100,
                opacity: 0,
              }}
              transition={{ delay: 0.2 }}
              className="w-1/5 absolute z-[2] right-[5%]"
              src="/images/ben-stokes.png"
              alt=""
            />
          </div>
        </div>

        <div className="px-8 lg:px-16">
          <div className="bg-purple-2 py-6 px-10 mt-10 relative">
            <h1 className="text-[4rem] leading-[4rem] font-bold text-pink-1">
              CELEBRATING
            </h1>
            <p className="text-white text-2xl font-bold font-cwc-india mb-5">
              India hosting the ICCWC23
            </p>

            <Link to="/dashboard">
              <Button
                color="pink"
                clip={0}
                disabled={isLoading}
                id="home-page/play-now"
              >
                Play Now
              </Button>
            </Link>

            <img
              className="absolute bottom-0 right-0 w-[12.5rem]"
              src="/images/bottom-right-corner.svg"
              alt=""
            />
          </div>

          <div className="my-10">
            <h1 className="text-3xl text-center mb-5 font-bold text-purple-1">
              <span className="text-pink-1">Tournament</span> Prizes
            </h1>
            <div className="flex flex-wrap lg:flex-nowrap justify-center mt-5">
              <div className="bg-purple-2 cursor-pointer font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  <div className="text-xs text-pink-1 leading-[0.6rem]">
                    1st Rank
                  </div>
                  <div className="text-base text-white">
                    Amazon ₹10000 Voucher
                  </div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div>
                  <div className="text-base text-white">Android Tablet</div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  <div className="text-xs text-pink-1 leading-[0.6rem]">
                    3rd Rank
                  </div>
                  <div className="text-base text-white">Android Smartphone</div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc lg:hidden">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  <div className="text-xs text-pink-1 leading-[0.6rem]">
                    Top 5 Runners Up
                  </div>
                  <div className="text-base text-white">
                    Android Smartwatches
                  </div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
            </div>
            <div className="justify-center hidden lg:flex w-full">
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 pb-2 pt-3 font-cwc inline-block">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  <div className="text-xs text-pink-1 leading-[0.6rem]">
                    Top 5 Runners Up
                  </div>
                  <div className="text-base text-white">
                    Android Smartwatches
                  </div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="my-10">
            <h1 className="text-3xl text-center mb-5 font-bold text-purple-1">
              <span className="text-pink-1">Daily</span> Prize Pool
              <sup className="text-md">*</sup>
            </h1>
            <div className="flex flex-wrap justify-center mt-5">
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
                  <div className="text-base text-white">
                    70% off Live Course
                  </div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
                  <div className="text-base text-white">
                    50% off Live Course
                  </div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
                  <div className="text-base text-white">
                    20% off Classroom Course
                  </div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
                  <div className="text-base text-white">
                    10% off Classroom Course
                  </div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    1st Rank
                  </div> */}
                  <div className="text-base text-white">
                    CodingBlocks Laptop Backpack
                  </div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    2nd Rank
                  </div> */}
                  <div className="text-base text-white">Sipper Bottle</div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    3rd Rank
                  </div> */}
                  <div className="text-base text-white">Swagpack</div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc lg:hidden">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    Top 5 Runners Up
                  </div> */}
                  <div className="text-base text-white">Notebook</div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
              <div className="bg-purple-2 cursor-pointer justify-self-center font-bold relative text-center my-2 mx-3 px-10 py-3 font-cwc inline-block">
                <div className="transition ease-in-out hover:translate-y-[-2px]">
                  {/* <div className="text-xs text-pink-1 leading-[0.6rem]">
                    Top 5 Runners Up
                  </div> */}
                  <div className="text-base text-white">T-Shirts</div>
                </div>
                <img
                  className="absolute bottom-0 w-[3.125rem] left-0"
                  src="/images/bottom-left-corner.svg"
                  alt=""
                />
                <img
                  className="absolute bottom-0 w-[4.5rem] right-0"
                  src="/images/bottom-right-corner.svg"
                  alt=""
                />
              </div>
            </div>
            <h6 className="text-purple-1 text-center text-xs font-bold">
              <sup>*</sup>All prices except discount coupon to be collected from{" "}
              <a
                href="https://codingblocks.com/contactus.html"
                target="_blank"
                className="text-pink-1"
              >
                physical centers
              </a>
              .
            </h6>
          </div>
        </div>
        <HowToPlay />
      </div>
    </Container>
  );
}
