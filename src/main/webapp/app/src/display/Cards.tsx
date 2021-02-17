/*
 * colabzero
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */

import * as React from "react";
import {ZeroState, TDispatch, createCard, updateCard, patchCard, cancelChanges} from "../store";
import {Card, Change} from "../API/client";
import {connect, useSelector} from "react-redux";
import {itemCard, cardStyle, cardTitle, cardContent, cardTitleText, iconStyle} from "./style";
import {Destroyer} from "./Destroyer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {flowers} from '../words/flowers.json'
import {adjs} from '../words/adjs.json'
import {nouns} from '../words/nouns.json'
import {TextEditor} from "./TextEditor";
import {AutoSaveTextEditor} from "./AutoSaveTextEditor";
import {LiveTextEditor} from "./LiveTextEditor";

import * as LiveHelper from '../utils/LiveHelper';

interface StateProps {
};

interface DispatchProps {
  onSave: (card: Card) => void;
  onPatch: (card: Card, change: Change) => void;
  cancelChanges: (card: Card) => void;
}

interface OwnProps {
  card: Card;
}

type Props = StateProps & DispatchProps & OwnProps;


const CardDisplayInternal = ({card, onSave, onPatch}: Props) => {

  const changes = useSelector<ZeroState, Change[]>((state) => {
    if (card.id &&  state.liveChanges["Card"] && state.liveChanges["Card"][card.id]) {
      return [...state.liveChanges["Card"][card.id]];
    } else {
      return [];
    }
  }, LiveHelper.changesEquals);

  return (
    <div className={cardStyle}>
      <div className={cardTitle}>
        <span className={cardTitleText} ># {card.id}</span>
        <Destroyer card={card} />
      </div>
      <div className={cardContent}>
        Manual:
        <TextEditor
          value={card.content}
          onChange={(newValue) =>
            onSave({...card, content: newValue})
          }
        />
        AutoSave:
        <AutoSaveTextEditor
          value={card.content}
          onChange={(newValue) =>
            onSave({...card, content: newValue})
          }
        />
        Live:
        <LiveTextEditor
          atClass="Card"
          atId={card.id!}
          changes={changes}
          value={card.content}
          onChange={(newValue) =>
            onPatch(card, newValue)
          }
        />
      </div>
    </div>
  );
};

export const CardDisplay = connect<StateProps, DispatchProps, OwnProps, ZeroState>(
  state => ({
    liveSession: state.wsSession
  }),
  (dispatch: TDispatch) => ({
    onPatch: (card: Card, change: Change) => {
      dispatch(patchCard(card, change));
    },
    onSave: (card: Card) => {
      dispatch(updateCard(card));
    },
    cancelChanges: (card: Card) => {
      dispatch(cancelChanges(card));
    }
  })
)(CardDisplayInternal);

function InternalCardsDisplay({cards}: {cards: Card[]}) {
  return <div>
    {cards.sort((a, b) => (a.id || 0) - (b.id || 0)).map(card => (
      <CardDisplay key={card.id} card={card} />
    ))}
  </div>
}

export const Cards = connect<{cards: Card[]}, {}, {}, ZeroState>(
  state => ({
    cards: Object.values(state.cards)
  }),
  (dispatch: TDispatch) => ({
  })
)(InternalCardsDisplay);


const genRandomContent = () => {
  return adjs[Math.floor(Math.random() * adjs.length)] + " " + flowers[Math.floor(Math.random() * flowers.length)];
}

const CreateRandomCardInternal = ({onSave}: {onSave: (card: Card) => void}) => {
  return <div>
    <FontAwesomeIcon
      className={iconStyle}
      icon={faPlus}
      onClick={() => {
        onSave({
          "@class": "Card",
          revision: 0,
          content: genRandomContent(),
          externalId: "",
          creationTime: (new Date()).getTime()
        });
      }}
    />
  </div>;
}

export const CreateRandomCard = connect<{}, {onSave: (card: Card) => void}, {}, ZeroState>(
  state => ({
  }),
  (dispatch: TDispatch) => ({
    onSave: (card: Card) => {
      dispatch(createCard(card));
    },
  })
)(CreateRandomCardInternal);

