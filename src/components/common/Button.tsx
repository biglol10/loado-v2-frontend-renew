import { usePreventMultipleClick } from '@/utils/hooks/usePreventMultipleClick';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

const StyledButton = styled(MuiButton)<ButtonProps>`
  position: relative;

  .loading-indicator {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
  }

  // 로딩 중일 때 텍스트 투명화 (공간은 유지)
  ${(props) =>
    props.loading &&
    `
    .button-text {
      opacity: 0;
    }
  `}
`;

const Button = ({ children, loading = false, disabled, onClick, ...props }: ButtonProps) => {
  const { onClickHandler } = usePreventMultipleClick(disabled, onClick);

  return (
    <StyledButton disabled={loading || disabled} onClick={onClickHandler} {...props}>
      {children}
      {loading && <CircularProgress size={20} className="loading-indicator" />}
    </StyledButton>
  );
};

export default Button;
