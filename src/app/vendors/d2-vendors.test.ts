import { DestinyAccount } from 'app/accounts/destiny-account';
import { getBuckets } from 'app/destiny2/d2-buckets';
import { mergeCollectibles } from 'app/inventory/d2-stores';
import { getTestDefinitions, getTestProfile, getTestVendors } from 'testing/test-utils';
import { D2VendorGroup, toVendorGroups } from './d2-vendors';

async function getTestVendorGroups() {
  const defs = await getTestDefinitions();
  const profileResponse = getTestProfile();
  const vendorsResponse = getTestVendors();
  const buckets = getBuckets(defs);
  const mergedCollectibles = mergeCollectibles(
    profileResponse.profileCollectibles,
    profileResponse.characterCollectibles
  );
  const account: DestinyAccount = {
    displayName: '',
    originalPlatformType: 2,
    platformLabel: '',
    membershipId: '',
    destinyVersion: 1,
    platforms: [],
    lastPlayed: new Date(),
  };
  const characterId = Object.keys(profileResponse.characters.data!)[0];

  return toVendorGroups(
    vendorsResponse,
    profileResponse,
    defs,
    buckets,
    account,
    characterId,
    mergedCollectibles
  );
}

function* allSaleItems(vendorGroups: D2VendorGroup[]) {
  for (const vendorGroup of vendorGroups) {
    for (const vendor of vendorGroup.vendors) {
      for (const saleItem of vendor.items) {
        yield saleItem;
      }
    }
  }
}

describe('process vendors', () => {
  it('can process vendors without errors', async () => {
    const vendorGroups = await getTestVendorGroups();

    // Check that there are any vendors
    expect(vendorGroups.length).toBeGreaterThan(0);

    // Check that there's any item that has pattern unlock info - there should be some!
    let vendorItemPatternFound = false;
    for (const saleItem of allSaleItems(vendorGroups)) {
      if (saleItem.item?.patternUnlockRecord) {
        vendorItemPatternFound = true;
        break;
      }
    }
    expect(vendorItemPatternFound).toBe(true);
  });
});
