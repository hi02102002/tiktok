import {
    ChangeEvent,
    MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useRouter } from 'next/router';

import { useDebounce, useGetWidthParent } from '@/hooks';
import usersServices from '@/services/users.services';
import { IUser } from '@/types';
import Tippy from '@tippyjs/react/headless';
import { HiOutlineSearch } from 'react-icons/hi';
import { IoIosCloseCircle } from 'react-icons/io';

import SectionUser from '../SectionUser';
import Spiner from '../Spiner';

const PAGE = 1;
const LIMIT = 5;

const Search = () => {
    const [textSearch, setTextSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<IUser>>([]);
    const debounceValue = useDebounce(textSearch, 800);
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false);
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTextSearch(e.target.value);
    }, []);
    const [loading, setLoading] = useState<boolean>(false);
    const $inputRef = useRef<HTMLInputElement | null>(null);
    const { width: widthSearchDropdown, parentRef: $searchWrapperRef } =
        useGetWidthParent();

    const handleNavigateToSearch = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            if (!debounceValue.trim()) {
                return;
            }
            router.push({
                pathname: '/search',
                query: {
                    q: debounceValue,
                    page: PAGE,
                    limit: LIMIT,
                },
            });
        },
        [debounceValue, router],
    );

    const handleCancel = () => {
        setShow(false);
        $inputRef.current?.focus();
        setTextSearch('');
    };

    useEffect(() => {
        (async () => {
            try {
                if (!debounceValue.trim()) {
                    setSearchResult([]);
                    return;
                }
                setLoading(true);
                const result = await usersServices.searchUsers(
                    debounceValue,
                    LIMIT,
                    PAGE,
                );
                setSearchResult(result);
            } catch (error) {
                console.log(error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        })();
    }, [debounceValue]);

    return (
        <div>
            <Tippy
                render={(attrs) => (
                    <div
                        className="w-full"
                        tabIndex={-1}
                        {...attrs}
                        style={{
                            width:
                                widthSearchDropdown ||
                                $searchWrapperRef.current?.offsetWidth,
                        }}
                    >
                        <ul className="py-2 bg-white shadow rounded">
                            <h3 className="px-4 py-2 font-semibold">
                                Accounts
                            </h3>
                            {searchResult.map((user) => {
                                return (
                                    <li key={user._id}>
                                        <SectionUser
                                            user={user}
                                            sizeAvatar={32}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                interactive
                visible={searchResult.length > 0 && show}
                onClickOutside={() => {
                    setShow(false);
                }}
            >
                <div className="max-w-[360px] flex-1" ref={$searchWrapperRef}>
                    <form className="px-4 py-2 w-full rounded-full bg-neutral-100 flex items-center focus-within:border-neutral-300 border border-transparent transition-all overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="bg-transparent outline-0 placeholder:leading-[1] w-full"
                            value={textSearch}
                            onChange={handleChange}
                            onFocus={() => {
                                setShow(true);
                            }}
                            ref={$inputRef}
                        />
                        <div className="mx-4 w-4 flex items-center justify-center">
                            {loading ? (
                                <Spiner
                                    className="!text-neutral-500"
                                    size="16px"
                                />
                            ) : (
                                textSearch && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                    >
                                        <IoIosCloseCircle className="icon-16 text-neutral-500 " />
                                    </button>
                                )
                            )}
                        </div>
                        <span className="h-7 self-stretch w-[1px] mr-4 flex-shrink-0 bg-neutral-200"></span>
                        <button
                            type="button"
                            className="px-4 py-2 -mx-4 -my-2 self-stretch hover:bg-neutral-200"
                            onClick={handleNavigateToSearch}
                        >
                            <HiOutlineSearch className="icon-24 text-neutral-500 " />
                        </button>
                    </form>
                </div>
            </Tippy>
        </div>
    );
};

export default Search;
