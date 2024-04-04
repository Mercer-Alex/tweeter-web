import { DaoFactory } from "./DaoFactory";
import { DaoFactoryInterface } from "./DaoFactoryInterface";

export class DAOFactoryProvider {
	public getFactory(): DaoFactoryInterface {
		return new DaoFactory();
	}
}
