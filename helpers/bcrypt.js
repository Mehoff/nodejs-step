import bcrypt from 'bcrypt';

export const encrypt = async (str = "") => {
	const salt = await bcrypt.genSalt();
	const res = await bcrypt.hash(str, salt);
	return res;
};

export const encryptSync = (str = "") => {
	const salt = bcrypt.genSaltSync();
	const res = bcrypt.hashSync(str, salt);
	return res;
};

export const compare = async (a = "", b = "") => {
	const res = await bcrypt.compare(a, b);
	return res;
};

export const compareSync = (a = "", b = "") => {
	const res = bcrypt.compareSync(a, b);
	return res;
};