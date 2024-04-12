import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigation } from "@remix-run/react";
import Button from "../button";

export default function HowToPlay() {
  const navigation = useNavigation();
  return (
    <div className="my-10 bg-black bg-top-jhaalar bg-repeat-x p-8 lg:p-16">
      <div className="my-5">
        <div className="flex items-center justify-between mb-5">
          <div className="font-cwc-india text-3xl text-pink-1">
            How to <span className="text-white"> Play ?</span>
          </div>
          <Link to="/dashboard">
            <Button
              color="pink"
              clip={0}
              disabled={navigation.state === "loading"}
              id="play-now"
            >
              Play Now
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-0 lg:gap-4 lg:grid-cols-2 lg:grid-cols-3 mt-16">
          <div className="relative bg-purple-1 text-white px-8 py-10 mb-8">
            <div className="bg-yellow-1 text-black text-center w-6 h-6 absolute -top-3 left-8">
              1
            </div>
            <div className="font-bold text-lg">Select a Match</div>
            <div className="text-sm">Choose an Live or Upcoming match</div>
            <img
              className="absolute z-[1] -top-12 right-4 w-[10rem]"
              src="/images/cw-select-match.png"
              alt=""
            />
          </div>
          <div className="relative bg-purple-1 text-white px-8 py-10 mb-8">
            <div className="bg-yellow-1 text-black text-center w-6 h-6 absolute -top-3 left-8">
              2
            </div>
            <div className="font-bold text-lg">Create your Squad</div>
            <div className="text-sm">Choose any 6 topics of your choice</div>
            <img
              className="absolute z-[1] -top-12 right-4 w-[10rem]"
              src="/images/cw-create-squad.png"
              alt=""
            />
          </div>
          <div className="relative bg-purple-1 text-white px-8 py-10 mb-8">
            <div className="bg-yellow-1 text-black text-center w-6 h-6 absolute -top-3 left-8">
              3
            </div>
            <div className="font-bold text-lg">Play Match</div>
            <div className="text-sm">
              Answer as many questions as possible in 6 overs
            </div>
            <img
              className="absolute z-[1] -top-12 right-4 w-[10rem]"
              src="/images/cw-player.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="my-5">
        <span className="font-cwc-india text-3xl text-pink-1"> Scoring</span>
        <span className="font-cwc-india text-3xl text-white"> Rules</span>

        <div className="bg-purple-1 text-white p-10 mt-8">
          <div className="flex items-start my-3">
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              className="text-pink-1 w-4 h-4 mr-2 pt-1"
            />
            <span>
              You will get to play <span className="text-pink-1">5</span> overs
              ie. <span className="text-pink-1">30</span> balls(questions) in
              total.
            </span>
          </div>
          <div className="flex items-start my-3">
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              className="text-pink-1 w-4 h-4 mr-2 pt-1"
            />
            <span>
              A max of <span className="text-pink-1">6</span> runs can be scored
              against a ball. You will get{" "}
              <span className="text-pink-1">60secs</span> to answer the
              question. Every <span className="text-pink-1">10secs</span>{" "}
              elapsed the maximum score scorable on that ball will get reduced
              by <span className="text-pink-1">1</span>.
            </span>
          </div>
          <div className="flex items-start my-3">
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              className="text-pink-1 w-4 h-4 mr-2 pt-1"
            />
            <span>
              If no answer is selected and the timer runs out, you will get{" "}
              <span className="text-pink-1">0</span> score and that ball will be
              considered as <span className="text-pink-1">DOT</span> ball.
            </span>
          </div>
          <div className="flex items-start my-3">
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              className="text-pink-1 w-4 h-4 mr-2 pt-1"
            />
            <span>
              Submitting <span className="text-pink-1">wrong answer</span> will
              cost you a wicket.
            </span>
          </div>
          <div className="flex items-start my-3">
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              className="text-pink-1 w-4 h-4 mr-2 pt-1"
            />
            <span>
              <span className="text-pink-1">Refreshing</span> or{" "}
              <span className="text-pink-1">Closing</span> the player tab will
              result in marking the current ball as{" "}
              <span className="text-pink-1">DOT</span> ball.
            </span>
          </div>
          <div className="flex items-start my-3">
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              className="text-pink-1 w-4 h-4 mr-2 pt-1"
            />
            <span>
              Match will be ended if you have played{" "}
              <span className="text-pink-1">5</span> overs or you loose{" "}
              <span className="text-pink-1">5</span> wickets.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
