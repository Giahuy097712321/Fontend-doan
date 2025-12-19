import { Divider, Radio, Table, Button } from 'antd';
import React, { useState } from 'react';
import Loading from './../LoadingComponent/Loading';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data = [], columns = [], isLoading = false, handleDeleteManyProducts, showSelection = true } = props;
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const handleDeleteAll = () => {
    if (typeof handleDeleteManyProducts === 'function') {
      handleDeleteManyProducts(rowSelectedKeys);
    }
  };

  // Only enable rowSelection when showSelection is true
  const rowSelection = showSelection
    ? {
      type: selectionType,
      selectedRowKeys: rowSelectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        setRowSelectedKeys(selectedRowKeys);
      },
    }
    : null;

  const handleExportExcel = () => {
    if (!data || data.length === 0) return;

    // Lấy tất cả columns có dataIndex hoặc title làm header
    const exportData = data.map((row) => {
      const rowData = {};
      columns.forEach((col) => {
        if (col.dataIndex) {
          rowData[col.title || col.dataIndex] = row[col.dataIndex];
        }
      });
      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    let fileName = window.prompt('Nhập tên file muốn lưu:', 'Danh_sach_don_hang.xlsx');
    if (!fileName) return; // Bấm Cancel thì dừng, không xuất
    if (!fileName.endsWith('.xlsx')) fileName += '.xlsx';
    saveAs(blob, fileName);

    if (!fileName.endsWith('.xlsx')) fileName += '.xlsx';
    saveAs(blob, fileName);
  };

  return (
    <Loading isLoading={isLoading}>
      {showSelection && rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: '#1d1ddd',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
            cursor: 'pointer',
            marginBottom: 8
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <Button
        type="primary"
        style={{ marginBottom: 8, marginLeft: 8 }}
        onClick={handleExportExcel}
      >
        Export Excel
      </Button>
      <Table
        id="table-xls"
        rowSelection={showSelection ? rowSelection : undefined}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
