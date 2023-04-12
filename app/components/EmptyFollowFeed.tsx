import ButtonLink from "./ui/ButtonLink";

export default function EmptyFollowFeed() {
  return (
    <div className="w-full max-w-2xltext-center flex flex-col gap-10 relative">
      <div className="z-0 relative">
        <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-50 mb-5" />
        <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-20 mb-5" />
        <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-10 mb-5" />
        <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-5 mb-5" />
      </div>

      <div className="absolute top-[100px] left-1/2 z-10 -translate-x-1/2 text-center ">
        <div className="text-xl mb-10">You are not yet following anyone.</div>
        <div>
          <ButtonLink to={`/?sortBy=popular`} variant="button-primary">
            Find interesting users to follow
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
