import { Card } from "common/models/card";

export const newCard = (card: Card) => ({
	type: 'NEW_CARD' as const,
	payload: card,
})
