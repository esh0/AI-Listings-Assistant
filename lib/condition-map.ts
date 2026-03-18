import { ProductCondition } from "@prisma/client";
import type { ProductCondition as ProductConditionString } from "@/lib/types";

export const CONDITION_MAP: Record<string, ProductCondition> = {
    "nowy": ProductCondition.nowy,
    "używany, jak nowy": ProductCondition.uzywany_jak_nowy,
    "używany, w dobrym stanie": ProductCondition.uzywany_w_dobrym_stanie,
    "używany, w przeciętnym stanie": ProductCondition.uzywany_w_przecietnym_stanie,
    "uszkodzony": ProductCondition.uszkodzony,
};

export const CONDITION_MAP_REVERSE: Record<ProductCondition, ProductConditionString> = {
    [ProductCondition.nowy]: "nowy",
    [ProductCondition.uzywany_jak_nowy]: "używany, jak nowy",
    [ProductCondition.uzywany_w_dobrym_stanie]: "używany, w dobrym stanie",
    [ProductCondition.uzywany_w_przecietnym_stanie]: "używany, w przeciętnym stanie",
    [ProductCondition.uszkodzony]: "uszkodzony",
};
