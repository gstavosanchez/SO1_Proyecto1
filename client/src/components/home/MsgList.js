import PropTypes from 'prop-types';
export const MsgList = ({ msgList }) => {
  return (
    <div className="msg__container">
      <ul>
        {msgList.map((value, i) => (
          <li key={i} className="animate__animated animate__fadeIn">
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
};
MsgList.propTypes = {
  msgList: PropTypes.array.isRequired,
};
