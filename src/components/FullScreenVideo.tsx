const FullScreenVideo = ({ src }: { src: string }) => {
  return (
    <div className="full-screen-video">
      <video autoPlay loop muted>
        <source src={src} />
      </video>
    </div>
  );
};

export default FullScreenVideo;
