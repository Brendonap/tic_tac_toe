def checkWin(board, symbol):
    # given the state of the current game board, loops over possible win combinations 
    # to find if current win exisits
    possible_win_combinations = [
      ['0', '1', '2'],
      ['3', '4', '5'],
      ['6', '7', '8'],
      ['0', '3', '6'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['0', '4', '8'],
      ['2', '4', '6']
    ]

    isWin = False
    for combination in possible_win_combinations:
        if (board[int(combination[0])] == symbol and board[int(combination[1])] == symbol and board[int(combination[2])] == symbol):
            isWin = True
            break
    return isWin
        
def getComputerMove(game_board):
    # function to find best move for computer to make

    # Check computer win moves
    for box in range(0, 9):
        if game_board[box] == ' ' and testWinMove(game_board, 'X', box):
            return box

    # Check player win moves
    for box in range(0, 9):
        if game_board[box] == ' ' and testWinMove(game_board, '0', box):
            return box
    # Check computer fork opportunities
    for box in range(0, 9):
        if game_board[box] == ' ' and testForkMove(game_board, 'X', box):
            return box
    # Check player fork opportunities
    possible_forks = 0
    for box in range(0, 9):
        if game_board[box] == ' ' and testForkMove(game_board, '0', box):
            possible_forks += 1
            temp_move = box
    if possible_forks == 1:
        return temp_move
    elif possible_forks == 2:
        for box in [1, 3, 5, 7]:
            if game_board[box] == ' ':
                return box
    # Play middle
    if game_board[4] == ' ':
        return 4
    # Play a corner
    for box in [0, 2, 6, 8]:
        if game_board[box] == ' ':
            return box
    #Play a side
    for box in [1, 3, 5, 7]:
        if game_board[box] == ' ':
            return box


def getBoardCopy(game_board):
    # Make a duplicate of the board. When testing moves we don't want to 
    # change the actual board
    new_test_board = []
    for box in game_board:
        new_test_board.append(box)
    return new_test_board

def testForkMove(game_board, symbol, box):
    # Determines if a move opens up a fork
    board_copy = getBoardCopy(game_board)
    board_copy[box] = symbol
    winning_moves = 0
    for box_index in range(0, 9):
        if testWinMove(board_copy, symbol, box_index) and board_copy[box_index] == ' ':
            winning_moves += 1
    return winning_moves >= 2


def testWinMove(game_board, symbol, box):
    board_copy = getBoardCopy(game_board)
    board_copy[box] = symbol
    return checkWin(board_copy, symbol)
