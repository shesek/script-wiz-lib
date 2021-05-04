import IStackData from "./IStackData";
interface IParseResult {
    main: {
        addDataArray: IStackData[];
        removeLastSize: number;
    };
    alt: {
        addData?: IStackData;
        removeLastStackData: boolean;
    };
    flow?: boolean[];
    altFlow?: boolean[];
}
export default IParseResult;