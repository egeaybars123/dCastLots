//const reader = require("xlsx");
import * as reader from "xlsx";

function retrieve_data(file_dir) {
    const file = reader.readFile(file_dir);
    let data = [];

    const sheets = file.SheetNames;

    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]]
        );
        temp.forEach((res) => {
            const values = Object.values(res);
            data.push(values[0]);
        });

    }

    console.log(data);

    return data;
}

export {retrieve_data};
