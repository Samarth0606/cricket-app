import reactTimerHook, { type TimerSettings } from "react-timer-hook";
import CountdownTab from "./countdown-tab";

export type CountdownProps = TimerSettings;

export default function Countdown(props: CountdownProps) {
  const { days, hours, minutes } = reactTimerHook.useTimer({
    expiryTimestamp: props.expiryTimestamp,
  });

  let daysInString = String(days);
  let d = daysInString.length === 1 ? `0${daysInString}` : daysInString;
  let hoursInString = String(hours);
  let h = hoursInString.length === 1 ? `0${hoursInString}` : hoursInString;
  let minutesInString = String(minutes);
  let m =
    minutesInString.length === 1 ? `0${minutesInString}` : minutesInString;

  return (
    <div className="space-x-5 flex items-center">
      <div>
        <div className="flex space-x-1">
          <CountdownTab>{d.split("")[0]}</CountdownTab>
          <CountdownTab>{d.split("")[1]}</CountdownTab>
        </div>
        <p className="text-center text-white font-medium uppercase text-xs">
          Days
        </p>
      </div>
      <div>
        <div className="flex space-x-1">
          <CountdownTab>{h.split("")[0]}</CountdownTab>
          <CountdownTab>{h.split("")[1]}</CountdownTab>
        </div>
        <p className="text-center text-white font-medium uppercase text-xs">
          HRS
        </p>
      </div>
      <div>
        <div className="flex space-x-1">
          <CountdownTab>{m.split("")[0]}</CountdownTab>
          <CountdownTab>{m.split("")[1]}</CountdownTab>
        </div>
        <p className="text-center text-white font-medium uppercase text-xs">
          MINS
        </p>
      </div>
    </div>
  );
}
