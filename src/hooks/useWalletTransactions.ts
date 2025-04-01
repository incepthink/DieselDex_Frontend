import { gql, request } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { B256Address } from "fuels";
import { BackendUrl, IndexerUrl } from "@/utils/constants";
import { clientAxios } from "@/utils/common";

export type TransactionsData = {
  Transaction: {
    initiator: B256Address;
    asset_0_in: string;
    asset_0_out: string;
    asset_1_in: string;
    asset_1_out: string;
    block_time: number;
    is_contract_initiator: boolean;
    pool_id: string;
    transaction_type: "ADD_LIQUIDITY" | "REMOVE_LIQUIDITY" | "SWAP";
  }[];
};

export type Transaction = {
  initiator: B256Address;
  asset_0_in: string;
  asset_0_out: string;
  asset_1_in: string;
  asset_1_out: string;
  block_time: number;
  is_contract_initiator: boolean;
  pool_id: string;
  transaction_type: "ADD_LIQUIDITY" | "REMOVE_LIQUIDITY" | "SWAP";
};

const useWalletTransactions = (
  account: B256Address | null,
  fetchCondition: boolean
) => {
  // const query = gql`
  //   query Transactions($owner: String, $offset: Int, $limit: Int) {
  //     Transaction(
  //       where: { initiator: { _eq: $owner } }
  //       offset: $offset
  //       limit: $limit
  //     ) {
  //       asset_0_in
  //       asset_0_out
  //       asset_1_in
  //       asset_1_out
  //       block_time
  //       pool_id
  //       transaction_type
  //     }
  //   }
  // `;

  const shouldFetch = Boolean(account) && Boolean(fetchCondition);

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", account],
    queryFn: async () => {
      const res = await clientAxios.get(
        `${BackendUrl}/platform/user/${account}`
      );
      console.log(res.data);

      if (!res.data.transactions) {
        return [
          {
            asset_0_in: "75000000000",
            asset_0_out: "0",
            asset_1_in: "937157",
            asset_1_out: "0",
            block_time: 1736935009,
            pool_id:
              "0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82_0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07_false",
            transaction_type: "ADD_LIQUIDITY",
            initiator:
              "0x5a294f78f652585ae48d6ee648c86494f8dbd791882028544d305bc6e87e29c7",
          },
        ];
      }

      return res.data.transactions.reverse();
    },
    enabled: shouldFetch,
  });

  return { transactions: data as Transaction[] };
};

export default useWalletTransactions;
