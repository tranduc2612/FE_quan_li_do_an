import { GridRenderCellParams } from "@mui/x-data-grid";
import { Link } from "mdi-material-ui";
import * as React from 'react';
function ExpandableCell({ value }: GridRenderCellParams) {
    const [expanded, setExpanded] = React.useState(false);
  
    return (
      <div className="text-base p-3 break-words w-full">
        <span style={{
          whiteSpace: "pre-wrap"
        }}>
          {expanded ? value : value?.toString().slice(0, 200)}
        </span>
        {value?.length > 200 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <span
            className="cursor-pointer text-xs underline text-primary-blue"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <span className="ms-1">Thu gọn</span> : <span className="">&#8230;Xem thêm</span>}
          </span>
        )}
      </div>
    );
  }

  export default ExpandableCell