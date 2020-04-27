import React, { CSSProperties } from 'react';
import { BalanceLevel, Channel } from 'types/state';
import { ellipseInside } from 'util/strings';
import { Column, Row } from 'components/common/grid';
import StatusDot from 'components/common/StatusDot';
import { Title } from 'components/common/text';
import { styled } from 'components/theme';
import ChannelBalance from './ChannelBalance';

/**
 * the virtualized list requires each row to have a specified
 * height. Defining a const here because it is used in multiple places
 */
export const ROW_HEIGHT = 60;

const Styled = {
  Row: styled(Row)`
    border-bottom: 0.5px solid ${props => props.theme.colors.darkGray};

    &:last-child {
      border-bottom-width: 0;
    }
  `,
  Column: styled(Column)<{ last?: boolean }>`
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: ${ROW_HEIGHT}px;
  `,
  StatusIcon: styled.span`
    float: left;
    margin-top: -1px;
    margin-left: 15px;
    color: ${props => props.theme.colors.pink};
  `,
  Balance: styled(ChannelBalance)`
    margin-top: ${ROW_HEIGHT / 2 - 2}px;
  `,
};

export const ChannelRowHeader: React.FC = () => (
  <Row>
    <Column right>
      <Title>Can Receive</Title>
    </Column>
    <Column cols={3}></Column>
    <Column>
      <Title>Can Send</Title>
    </Column>
    <Column>
      <Title>Up Time %</Title>
    </Column>
    <Column>
      <Title>Peer/Alias</Title>
    </Column>
    <Column right>
      <Title>Capacity</Title>
    </Column>
  </Row>
);

const ChannelDot: React.FC<{ channel: Channel }> = ({ channel }) => {
  if (!channel.active) return <StatusDot status="idle" />;

  switch (channel.balanceLevel) {
    case BalanceLevel.good:
      return <StatusDot status="success" />;
    case BalanceLevel.warn:
      return <StatusDot status="warn" />;
    case BalanceLevel.bad:
      return <StatusDot status="error" />;
  }
};

interface Props {
  channel: Channel;
  style?: CSSProperties;
}

const ChannelRow: React.FC<Props> = ({ channel, style }) => {
  const { Row, Column, StatusIcon, Balance } = Styled;
  return (
    <Row style={style}>
      <Column right>
        <StatusIcon>
          <ChannelDot channel={channel} />
        </StatusIcon>
        {channel.remoteBalance.toLocaleString()}
      </Column>
      <Column cols={3}>
        <Balance channel={channel} />
      </Column>
      <Column>{channel.localBalance.toLocaleString()}</Column>
      <Column>{channel.uptime}</Column>
      <Column>{ellipseInside(channel.remotePubkey)}</Column>
      <Column right>{channel.capacity.toLocaleString()}</Column>
    </Row>
  );
};

export default ChannelRow;
