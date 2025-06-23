import { faArrowRight, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Empty from "../Empty/empty";
import './table.scss';

export default function Table({
    data = [],
    emptyMessage = 'There are no items in the table',
    useOptions = false,
    deleteCallback = undefined,
    detailsCallback = undefined,
    page = 1,
    itemsPerPage = 10
}) {
    if (data.length > 0) {
        var columns = Object.keys(data[0]);
        const start = (page - 1) * itemsPerPage;
        const pageData = data.slice(start, start + itemsPerPage);
        var rows = pageData.map(row => columns.map(column => row[column]));
        
        return (
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            {columns.slice(1).map(column => (
                                <th key={column}>{column}</th>
                            ))}
                            {useOptions && <th>Opções</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                {row.slice(1).map((cell, index) => (
                                    <td data-label={columns[index + 1]} key={index}>{cell}</td>
                                ))}
                                {useOptions && (
                                    <td className="options" data-label={'Options'}>
                                        {deleteCallback && (
                                            <FontAwesomeIcon
                                                className="option"
                                                icon={faTrashCan}
                                                color="#004AAD"
                                                height={"1rem"}
                                                width="1rem"
                                                onClick={() => deleteCallback(data[index][columns[0]])}
                                            />
                                        )}
                                        {detailsCallback && (
                                            <FontAwesomeIcon
                                                className="option"
                                                icon={faArrowRight}
                                                color="#004AAD"
                                                height={"1rem"}
                                                width="1rem"
                                                onClick={() => detailsCallback(data[index][columns[0]])} // Use the value from the first column
                                            />
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return <Empty message={emptyMessage} />;
    }
}
