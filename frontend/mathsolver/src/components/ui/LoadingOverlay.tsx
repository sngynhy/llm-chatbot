import React from "react";
import useLoading from "hooks/useLoading";
import { ScaleLoader, BeatLoader, ClipLoader } from "react-spinners";

// 📍 로딩 화면 생성
export const LoadingOverlay = () => {
  const { isLoading } = useLoading();
  if (!isLoading) return <></>;

  return (
    <div style={styles.overlay}>
      <ScaleLoader color="rgba(150, 152, 163, 0.5)" />
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // backdropFilter: 'blur(10px)',
    // backgroundColor: "rgba(1, 1, 1, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
};

export default LoadingOverlay;
