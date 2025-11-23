import { ScaleDisplay } from "@/components/ScaleDisplay";
import { useAcaiaScale } from "@/hooks/useAcaiaScale";

const Index = () => {
  const { weight, isConnected, battery, connect, disconnect, tare } = useAcaiaScale();

  const handleToggleConnection = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  return (
    <ScaleDisplay
      weight={weight}
      isConnected={isConnected}
      battery={battery}
      onTare={tare}
      onToggleConnection={handleToggleConnection}
    />
  );
};

export default Index;
