// style.js
import { Row } from 'antd';
import styled from 'styled-components';

export const WapperHeader = styled(Row)`
  padding: 10px 0;
  width:1270px;

  background-color: rgb(26, 148, 255);
  align-items:center;
  gap:16px;
  flex-wrap:nowrap;
  

`;

export const WapperTextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align:left;
    text-align: center;   // ✅ đổi từ left thành center
  display: block;   
`;
export const WapperHeaderAccount=styled.div`
display:flex;
align-items:center;
color:#fff;
gap:10px;

`
export const WapperTextHeaderSmall=styled.span`
font-size:12px;
color:#fff;
white-space:nowrap;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        background: rgb(26,148,255);
        
    }
`;
