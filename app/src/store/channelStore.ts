import { action, computed, observable, ObservableMap, toJS, values } from 'mobx';
import { Store } from 'store';
import Channel from './models/channel';

export default class ChannelStore {
  private _store: Store;

  /** the collection of channels */
  @observable channels: ObservableMap<string, Channel> = observable.map();

  constructor(store: Store) {
    this._store = store;
  }

  /**
   * an array of channels sorted by balance percent descending
   */
  @computed get sortedChannels() {
    return values(this.channels)
      .slice()
      .sort((a, b) => b.balancePercent - a.balancePercent);
  }

  /**
   * the sum of remote balance for all channels
   */
  @computed get totalInbound() {
    return this.sortedChannels.reduce((sum, chan) => sum + chan.remoteBalance, 0);
  }

  /**
   * the sum of local balance for all channels
   */
  @computed get totalOutbound() {
    return this.sortedChannels.reduce((sum, chan) => sum + chan.localBalance, 0);
  }

  /**
   * queries the LND api to fetch the list of channels and stores them
   * in the state
   */
  @action.bound
  async fetchChannels() {
    this._store.log.info('fetching channels');

    const { channelsList } = await this._store.api.lnd.listChannels();
    channelsList.forEach(lndChan => {
      // update existing channels or create new ones in state. using this
      // approach instead of overwriting the array will cause fewer state
      // mutations, resulting in better react rendering performance
      const existing = this.channels.get(lndChan.chanId);
      if (existing) {
        existing.update(lndChan);
      } else {
        this.channels.set(lndChan.chanId, new Channel(lndChan));
      }
    });
    // remove any channels in state that are not in the API response
    const serverIds = channelsList.map(c => c.chanId);
    const localIds = Object.keys(this.channels);
    localIds
      .filter(id => !serverIds.includes(id))
      .forEach(id => this.channels.delete(id));

    this._store.log.info('updated channelStore.channels', toJS(this.channels));
  }
}
