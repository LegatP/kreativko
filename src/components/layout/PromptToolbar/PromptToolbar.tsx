import { DesignStyle } from "@/types/product.types";
import { Card, Tooltip } from "@heroui/react";
import { WarningCircleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import cx from "classnames";
import { useAppStateContext } from "@/components/contexts/AppContext";
import { DesignStyleConfig } from "@/config";

export default function PromptToolbar() {
  const { state, setState } = useAppStateContext();

  const currentDesignStyle = state.designStyle;

  function onDesignStyleChange(designStyle: DesignStyle) {
    setState({
      ...state,
      designStyle,
    });
  }

  return (
    <div className="flex flex-row justify-between items-end mb-2">
      <div className="flex flex-row gap-2">
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
      <div className="flex flex-row gap-1 text-gray-400 text-xs items-center">
        <WarningCircleIcon size={16} weight="fill" />
        <p>Končni izdelek lahko od predogleda odstopa.</p>
      </div>
    </div>
  );
}
