import styled from 'styled-components';
import { Form, Button } from 'antd';

export const FormPost = styled(Form)`
    && {
        margin-bottom: 10px
    }
    & textarea {
        margin-bottom: 5px;
    }
`;
export const FormPostDiv = styled.div`
    && {
        margin-bottom: 5px;
    }
`;
export const PostBtn = styled(Button)`
    && {
        float: right;
    }
`;
export const ImageDiv = styled.div`
    && {
        display: inline-block;
    }
    & img {
        width: 200px;
    }
`;