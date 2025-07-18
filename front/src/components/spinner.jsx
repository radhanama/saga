import MoonLoader from "react-spinners/MoonLoader";

export default function Spinner({color="#3A6EA5", loading, override, size=150})
{
    return (
      <div style={{justifySelf: "center", alignSelf:"center", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <MoonLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
      />
      </div>
    );
}