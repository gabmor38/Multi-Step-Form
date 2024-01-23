import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IScwV2Props {
  context: WebPartContext
  environmentMessage: string;
  prefLang: string;
  requestor?: string;
  url?: string;
  themeVariant: IReadonlyTheme | undefined;
}
