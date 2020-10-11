/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api/lib/types";
import * as Observable from "zen-observable";

export type CreateOrderReservationInput = {
  itemId: number;
  title: string;
  subtitle: string;
  price: number;
};

export enum OrderStatus {
  INITIALIZED = "INITIALIZED",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED"
}

export enum OrderTransactionStatus {
  INITIALIZED = "INITIALIZED",
  BEING_PROCESSED = "BEING_PROCESSED",
  DONE = "DONE"
}

export type CreateOrderReservationMutation = {
  __typename: "OrderReserved";
  order: {
    __typename: "Order";
    id: string;
    status: OrderStatus;
    transactionStatus: OrderTransactionStatus;
    paymentId: string;
    itemId: number;
    title: string;
    subtitle: string;
    price: number;
    createdAt: string | null;
  };
  paymentIntent: {
    __typename: "StripePaymentIntent";
    amount: number | null;
    amount_capturable: number | null;
    amount_received: number | null;
    charges: string | null;
    client_secret: string | null;
    confirmation_method: string | null;
    created: number | null;
    currency: string | null;
    customer: string | null;
    description: string | null;
    id: string | null;
    invoice: string | null;
    metadata: string | null;
    object: string | null;
    payment_method_options: string | null;
    payment_method_types: Array<string | null> | null;
    status: string | null;
  };
};

export type ConfirmOrderReservationMutation = {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  transactionStatus: OrderTransactionStatus;
  paymentId: string;
  itemId: number;
  title: string;
  subtitle: string;
  price: number;
  createdAt: string | null;
};

export type CancelOrderReservationMutation = {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  transactionStatus: OrderTransactionStatus;
  paymentId: string;
  itemId: number;
  title: string;
  subtitle: string;
  price: number;
  createdAt: string | null;
};

export type FinalizeOrderMutation = {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  transactionStatus: OrderTransactionStatus;
  paymentId: string;
  itemId: number;
  title: string;
  subtitle: string;
  price: number;
  createdAt: string | null;
};

export type GetOrderStatusQuery = {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  transactionStatus: OrderTransactionStatus;
  paymentId: string;
  itemId: number;
  title: string;
  subtitle: string;
  price: number;
  createdAt: string | null;
};

export type OnOrderFinalizedSubscription = {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  transactionStatus: OrderTransactionStatus;
  paymentId: string;
  itemId: number;
  title: string;
  subtitle: string;
  price: number;
  createdAt: string | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateOrderReservation(
    input: CreateOrderReservationInput
  ): Promise<CreateOrderReservationMutation> {
    const statement = `mutation CreateOrderReservation($input: CreateOrderReservationInput!) {
        createOrderReservation(input: $input) {
          __typename
          order {
            __typename
            id
            status
            transactionStatus
            paymentId
            itemId
            title
            subtitle
            price
            createdAt
          }
          paymentIntent {
            __typename
            amount
            amount_capturable
            amount_received
            charges
            client_secret
            confirmation_method
            created
            currency
            customer
            description
            id
            invoice
            metadata
            object
            payment_method_options
            payment_method_types
            status
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateOrderReservationMutation>response.data.createOrderReservation;
  }
  async ConfirmOrderReservation(
    id: string
  ): Promise<ConfirmOrderReservationMutation> {
    const statement = `mutation ConfirmOrderReservation($id: ID!) {
        confirmOrderReservation(id: $id) {
          __typename
          id
          status
          transactionStatus
          paymentId
          itemId
          title
          subtitle
          price
          createdAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ConfirmOrderReservationMutation>(
      response.data.confirmOrderReservation
    );
  }
  async CancelOrderReservation(
    id: string
  ): Promise<CancelOrderReservationMutation> {
    const statement = `mutation CancelOrderReservation($id: ID!) {
        cancelOrderReservation(id: $id) {
          __typename
          id
          status
          transactionStatus
          paymentId
          itemId
          title
          subtitle
          price
          createdAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CancelOrderReservationMutation>response.data.cancelOrderReservation;
  }
  async FinalizeOrder(id: string): Promise<FinalizeOrderMutation> {
    const statement = `mutation FinalizeOrder($id: ID!) {
        finalizeOrder(id: $id) {
          __typename
          id
          status
          transactionStatus
          paymentId
          itemId
          title
          subtitle
          price
          createdAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <FinalizeOrderMutation>response.data.finalizeOrder;
  }
  async GetOrderStatus(id: string): Promise<GetOrderStatusQuery> {
    const statement = `query GetOrderStatus($id: ID!) {
        getOrderStatus(id: $id) {
          __typename
          id
          status
          transactionStatus
          paymentId
          itemId
          title
          subtitle
          price
          createdAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetOrderStatusQuery>response.data.getOrderStatus;
  }
  OnOrderFinalizedListener: Observable<
    OnOrderFinalizedSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnOrderFinalized {
        onOrderFinalized {
          __typename
          id
          status
          transactionStatus
          paymentId
          itemId
          title
          subtitle
          price
          createdAt
        }
      }`
    )
  ) as Observable<OnOrderFinalizedSubscription>;
}
