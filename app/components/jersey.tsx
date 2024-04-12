type JerseyProps = {
  width: string;
  height: string;
  primaryColor?: string;
  secondaryColor?: string;
  classes?: string
};

export default function Jersey({
  width,
  height,
  primaryColor = "#00",
  secondaryColor = "#000",
  classes
}: JerseyProps) {
  return (
    <svg
      // xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      // xmlns="http://www.w3.org/2000/svg"
      // xmlns:cc="http://creativecommons.org/ns#"
      // xmlns:dc="http://purl.org/dc/elements/1.1/"
      // xmlns:svg="http://www.w3.org/2000/svg"
      id="svg4955"
      // style="enable-background:new"
      viewBox="0 0 520 451.49"
      version="1.1"
      width={width}
      height={height}
      className={classes}
    >
      <g id="layer1" transform="translate(-111,-135)">
        <g id="g5551">
          <path
            id="path4965"
            d="m298.33 140c-72.149 13.529-110.22 25.777-135 35-43.843 68.004-32.755 74.211-45 106.67 24.863 30.413 65.899 33.872 103.33 43.333 8.7644-7.1645 13.973-28.551 18.333-53.333-34.81 107.95-6.5685 212.5-28.333 295 41.916 15.307 106.56 22.88 160 18.333v-388.33c-47.69-10.7-45.5-38.02-73.33-56.67z"
            fill={primaryColor}
          />
          <path
            id="path4965-9"
            d="m443.33 140.18c72.149 13.529 110.22 25.777 135 35 43.843 68.004 32.755 74.211 45 106.67-24.863 30.413-65.899 33.872-103.33 43.333-8.7644-7.1645-13.973-28.551-18.333-53.333 34.81 107.95 6.5685 212.5 28.333 295-41.916 15.307-106.56 22.88-160 18.333v-388.33c47.692-10.701 45.509-38.019 73.333-56.667z"
            fill={primaryColor}
          />
          <path
            id="path5499"
            d="m118.5 280c32.404 16.643 66.565 32.582 105.5 44l-6.5 13c-39.96-9.37-74.51-24.16-106.5-41.5l7.5-15.5z"
            fill={secondaryColor}
          />
          <path
            id="path5499-2"
            d="m623.5 281c-32.404 16.643-66.565 32.582-105.5 44l6.5 13c39.965-9.3688 74.511-24.155 106.5-41.5l-7.5-15.5z"
            fill={secondaryColor}
          />
          <path
            id="path5523"
            d="m297 140 13.5-5c56.728 79.624 89.503 45.471 120 0.5l13 5.5c-40.615 61.838-86.064 91.766-146.5-1z"
            fill={secondaryColor}
          />
          <path
            id="path5525"
            d="m230.51 314 42.49-39.65l-32.233 16.775 5.8605-33.55-17.581 39.65-19.05-44.22 20.512 61z"
            fill={secondaryColor}
          />
          <path
            id="path5525-5"
            d="m511.99 314.5-42.49-39.65l32.233 16.775-5.8605-33.55 17.581 39.65 19.05-44.22-20.512 61z"
            fill={secondaryColor}
          />
          <path
            id="path5549"
            d="m232.5 316.5c-13.361 78.988 2.2362 182.01-13.5 245.5 18.777 10.115 57.074 16.657 78.5 17.5-62.877 10.87-52.972-168.62-65-263z"
            fill={secondaryColor}
          />
        </g>
      </g>
    </svg>
  );
}
