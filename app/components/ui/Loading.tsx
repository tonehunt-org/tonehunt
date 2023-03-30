type LoadingProps = {
  size?: string;
};

export default function Loading({ size = "24" }: LoadingProps) {
  return (
    <svg id="loading-dots" height={size} viewBox="0 0 132 58" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>dots</title>
      <desc>Created with Sketch.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="loading-dots" fill="#A3A3A3">
          <circle id="dot1" cx="25" cy="30" r="13"></circle>
          <circle id="dot2" cx="65" cy="30" r="13"></circle>
          <circle id="dot3" cx="105" cy="30" r="13"></circle>
        </g>
      </g>
    </svg>
  );
}
