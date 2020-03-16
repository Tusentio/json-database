const fs = require('fs');

module.exports = {
    load(path) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, "{}");
        }

        return {
            _value: JSON.parse(fs.readFileSync(path)),
            $(key, def) {
                return this.get(key, def);
            },
            get(key, def) {
                if (typeof def == "undefined") def = null;
        
                return typeof this._value[key] != "undefined" ? this._value[key] : def;
            },
            set(key, value) {
                this._value[key] = value;
        
                if (this._value[key] === null) {
                    delete this._value[key];
                }
        
                this._save();
                return value;
            },
            _save() {
                fs.writeFileSync(path, JSON.stringify(this._value));
            }
        };
    }
}