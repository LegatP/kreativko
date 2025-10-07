import { DesignStyle, Product } from "@/types/product.types";
import { Card, Tooltip } from "@heroui/react";
import { WarningCircleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import cx from "classnames";
import { useAppStateContext } from "@/components/contexts/AppContext";
import { DesignStyleConfig } from "@/config";

export default function PromptToolbar() {
  const { state, setState, setViewState } = useAppStateContext();

  const currentDesignStyle = state.designStyle;
  const currentView = state.viewState?.currentView || "front";

  function onDesignStyleChange(designStyle: DesignStyle) {
    setState({
      ...state,
      designStyle,
    });
  }

  function handleViewChange(view: "front" | "back") {
    if (state.selectedProduct === Product.Umbrella) {
      // For umbrella, rotate by one section (60 degrees for 6 sections)
      const newRotation =
        (state.viewState?.umbrellaRotation || 0) + Math.PI / 3;
      setViewState({
        umbrellaRotation: newRotation,
      });
    } else {
      // For shirt and hoodie, switch between front and back
      setViewState({
        currentView: view,
      });
    }
  }

  // Don't show view buttons for umbrella or show different text
  const showFrontBackButtons = state.selectedProduct !== Product.Umbrella;
  const showRotateButton = state.selectedProduct === Product.Umbrella;

  return (
    <div className="absolute -top-12 w-full flex flex-row justify-between items-end mb-2">
      <div className="flex flex-row gap-2 flex-1">
        {Object.keys(DesignStyle).map((color) => (
          <Tooltip
            key={color}
            content={DesignStyleConfig[color as DesignStyle].description}
          >
            <Card
              className={cx(
                "aspect-square h-10 items-center justify-center",
                currentDesignStyle === color && "ring-2 ring-primary"
              )}
              radius="md"
              isPressable
              onPress={() => onDesignStyleChange(color as DesignStyle)}
            >
              <Image
                src={DesignStyleConfig[color as DesignStyle].imgUrl}
                alt={color}
                objectFit="cover"
                width={48}
                height={48}
              />
            </Card>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-row gap-2 flex-1">
        {showFrontBackButtons && (
          <>
            <Card
              className={cx(
                "px-3 py-1 rounded-full text-sm cursor-pointer",
                currentView === "front"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              isPressable
              onPress={() => handleViewChange("front")}
            >
              Sprednja stran
            </Card>
            <Card
              className={cx(
                "px-3 py-1 rounded-full text-sm cursor-pointer",
                currentView === "back"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              isPressable
              onPress={() => handleViewChange("back")}
            >
              Zadnja stran
            </Card>
          </>
        )}
        {showRotateButton && (
          <Card
            className="px-3 py-1 text-gray-600 rounded-full text-sm cursor-pointer hover:bg-gray-100"
            isPressable
            onPress={() => handleViewChange("front")} // This will rotate the umbrella
          >
            Rotiraj dežnik
          </Card>
        )}
      </div>
      <div className="flex flex-row gap-1 text-gray-400 text-xs items-center">
        <WarningCircleIcon size={16} weight="fill" />
        <p>Končni izdelek lahko od predogleda odstopa.</p>
      </div>
    </div>
  );
}
