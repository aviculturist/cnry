;; watcher
;; SIP009 INTERFACE
(impl-trait .nft-trait.nft-trait)
(define-non-fungible-token WATCHER uint)

;; CONSTANTS (UPPERCASE)
(define-constant AVICULTURIST tx-sender)
;; errors
(define-constant ERR_NOT_CALLED_FROM_CONTRACT (err u405)) ;; method not allowed
(define-constant ERR_WATCHED_CONTRACT_SET (err u406)) ;; method not allowed

;; VARIABLES (lowercase)
(define-data-var baseUri (string-ascii 210) "ipfs://Qm/{id}")
(define-data-var lastId uint u0)

;; STORAGE
(define-map watched-contract bool principal)

(define-map watchers
  { tokenId: uint }
  {
    contractTokenId: uint,      ;; the specific tokenId being watched
    watcherAddress: principal   ;; the principal doing the watching
  }
)

;;
;; CODE FOR SIP009 Start
;;
;; SIP009: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get lastId)))

;; SIP009: Get the token URI
(define-read-only (get-token-uri (id uint))
  (ok (some (var-get baseUri))))

;; SIP009: Get the owner of the specified token ID
(define-read-only (get-owner (tokenId uint))
  (ok (nft-get-owner? WATCHER tokenId)))

;; SIP009: Transfer token to a specified principal
;; DISABLED for testnet version
(define-public (transfer (tokenId uint) (sender principal) (recipient principal))
(err u500))
  ;; (if (and
  ;;       (is-eq tx-sender sender))
  ;;     (match (nft-transfer? CNRY tokenId sender recipient)
  ;;       success (ok success)
  ;;       error (err error))
  ;;     (err u500)))
;;
;; /CODE FOR SIP009 END
;;

;; TODO: wrap in ok()
(define-read-only (get-metadata (tokenId uint))
    (map-get? watchers {tokenId: tokenId}))

;; Can only be called by a watched contract
(define-private (called-from-watched)
  (let ((cnry-contract
          (unwrap! (map-get? watched-contract true)
                    false)))
    (is-eq contract-caller cnry-contract)))

;; Can only be called once
(define-public (add-watched-contract)
  (let ((contract (map-get? watched-contract true)))
    (asserts! (and (is-none contract)
              (map-insert watched-contract true tx-sender))
                ERR_WATCHED_CONTRACT_SET)
    (ok tx-sender)))

(define-public (get-watched-contract)
  (let ((contract (map-get? watched-contract true)))
    (ok contract)))

;; mint new watcher token
;; Can only be called by watched contract
(define-public (watch-token (contract-name (string-ascii 80)) (tokenId uint) (watcherAddress principal))
    (let ((nextId (+ u1 (var-get lastId)))) ;; There is no #0 WATCHER token
      (asserts! (called-from-watched) ERR_NOT_CALLED_FROM_CONTRACT)
      (match (nft-mint? WATCHER nextId watcherAddress)
        success
          (begin
            (var-set lastId nextId)
            (map-set watchers {tokenId: nextId}
            {
              contractTokenId: tokenId,
              watcherAddress: watcherAddress
            })
            (print { index: tokenId, contract: contract-caller, contractTokenId: tokenId, watcherAddress: watcherAddress })
            (ok nextId))
        error (err error))))
