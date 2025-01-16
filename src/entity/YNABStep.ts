import {ComponentConfigProps} from "./YNABConfig.ts";

export interface YNABStep {
    label: string;
    description: string;
    Component: React.FC<ComponentConfigProps>;
    onNext: () => boolean;
    nextButtonLabel?: string;
}