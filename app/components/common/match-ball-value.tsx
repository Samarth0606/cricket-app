import { faCircleDot } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { match_ball_values } from "@prisma/client";

export default function MatchBallValue({
  matchBallValue,
}: {
  matchBallValue: match_ball_values | null;
}) {
  switch (matchBallValue) {
    case "single": {
      return (
        <span className="w-6 h-6 bg-purple-1 rounded-full text-white font-bold flex items-center justify-center">
          1
        </span>
      );
    }
    case "double": {
      return (
        <span className="w-6 h-6 bg-purple-1 rounded-full text-white font-bold flex items-center justify-center">
          2
        </span>
      );
    }
    case "tripple": {
      return (
        <span className="w-6 h-6 bg-purple-1 rounded-full text-white font-bold flex items-center justify-center">
          3
        </span>
      );
    }
    case "four": {
      return (
        <span className="w-6 h-6 bg-pink-1 rounded-full text-white font-bold flex items-center justify-center">
          4
        </span>
      );
    }

    case "five": {
      return (
        <span className="w-6 h-6 bg-purple-1 rounded-full text-white font-bold flex items-center justify-center">
          5
        </span>
      );
    }

    case "six": {
      return (
        <span className="w-6 h-6 bg-yellow-1 rounded-full text-purple-1 font-bold flex items-center justify-center">
          6
        </span>
      );
    }

    case "wicket": {
      return (
        <span className="w-6 h-6 bg-red-1 rounded-full text-white font-bold flex items-center justify-center">
          W
        </span>
      );
    }

    case "dot": {
      return (
        <FontAwesomeIcon icon={faCircleDot} className="w-6 h-6 text-purple-1" />
      );
    }

    default: {
      return null;
    }
  }
}
