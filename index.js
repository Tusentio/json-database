const fs = require("fs");

class Database {

	/**
	 * @param {fs.PathLike} path - A path to a JSON file. If it does not exist, it is created with an empty object ```{}```.
	 */
	constructor(path) {
		this._path = path;

		if (fs.existsSync(path)) {
			this._state = JSON.parse(fs.readFileSync(path));
		} else {
			this._state = {};
			fs.writeFileSync(path, JSON.stringify(this._state));
		}
	}

	get path() {
		return this._path;
	}

	get state() {
		return this._state;
	}

	/**
	 * Same as ```Database.get(key, def)```.
	 *
	 * @param {string} key
	 * @param {*} [def] - A default value. (```null``` by default)
	 *
	 * @returns {*} The requested value or default if not found.
	 */
	$(key, def) {
		return this.get(key, def);
	}

	/**
	 * Gets the value of the specified key in the database.
	 *
	 * @param {string} key
	 * @param {*} [def] - A default value. (```null``` by default)
	 *
	 * @returns {*} The requested value or default if not found.
	 */
	get(key, def = null) {
		let ans = this._state[key];
		return typeof ans != "undefined" ? ans : def;
	}

	/**
	 * Sets a key in the database to the specified value. If the value is ```null``` or not specified, the key is removed from the database.
	 *
	 * @param {string} key - A key to set. Created if it doesn't already exist.
	 * @param {*} [value] - A value.
	 * @param {boolean} [save] - Call ```Database.save()``` when done. (```true``` by default)
	 *
	 * @returns {*} The new value or ```null``` if none specified.
	 */
	set(key, value = null, save = true) {
		this._state[key] = value;

		if (this._state[key] == null) {
			delete this._state[key];
		}

		if (save) this.save();
		return value;
	}

	/**
	 * Saves the internal memory state of the database to the loaded JSON file.
	 *
	 * @param {fs.PathLike} [path] - An alternative save destination.
	 */
	save(path = this._path) {
		fs.writeFileSync(path, JSON.stringify(this._state));
	}
}

module.exports = Database;
